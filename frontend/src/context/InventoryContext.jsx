import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { INITIAL_INVENTORY, INITIAL_WORLD_LOOT, ITEM_DEFINITIONS } from "../utils/constants";

const InventoryContext = createContext(null);

const FEEDBACK_TIMEOUT_MS = 1800;

const cloneSlot = (slot) => (slot ? { ...slot } : null);
const cloneDrop = (drop) => ({ ...drop });

const createInitialState = () => ({
  slots: INITIAL_INVENTORY.map(cloneSlot),
  selectedSlotIndex: null,
  isInventoryOpen: false,
  worldLoot: Object.fromEntries(
    Object.entries(INITIAL_WORLD_LOOT).map(([coordinateKey, loot]) => [
      coordinateKey,
      {
        ...loot,
        drops: loot.drops.map(cloneDrop),
      },
    ]),
  ),
  feedbackMessage: "",
});

const getItemDefinition = (itemId) => ITEM_DEFINITIONS[itemId];

const addItemToSlots = (slots, itemId, quantity) => {
  const item = getItemDefinition(itemId);

  if (!item || quantity <= 0) {
    return { nextSlots: slots, addedQuantity: 0, leftoverQuantity: quantity };
  }

  let remaining = quantity;
  const nextSlots = slots.map(cloneSlot);

  if (item.stackable) {
    nextSlots.forEach((slot) => {
      if (!slot || slot.itemId !== itemId || remaining === 0) {
        return;
      }

      const availableSpace = item.maxStack - slot.quantity;

      if (availableSpace <= 0) {
        return;
      }

      const quantityToAdd = Math.min(availableSpace, remaining);
      slot.quantity += quantityToAdd;
      remaining -= quantityToAdd;
    });
  }

  for (let index = 0; index < nextSlots.length && remaining > 0; index += 1) {
    if (nextSlots[index] !== null) {
      continue;
    }

    const quantityToAdd = item.stackable ? Math.min(item.maxStack, remaining) : 1;
    nextSlots[index] = { itemId, quantity: quantityToAdd };
    remaining -= quantityToAdd;
  }

  return {
    nextSlots,
    addedQuantity: quantity - remaining,
    leftoverQuantity: remaining,
  };
};

const getInventorySummary = (grantedDrops, leftoverDrops) => {
  const grantedText = grantedDrops
    .map(({ itemId, quantity }) => `${quantity} ${getItemDefinition(itemId)?.icon ?? itemId}`)
    .join(", ");

  if (grantedDrops.length === 0) {
    return "Inventory full.";
  }

  if (leftoverDrops.length > 0) {
    return `Collected ${grantedText}. Inventory is full for the rest.`;
  }

  return `Collected ${grantedText}.`;
};

const resolveInventorySelection = (slots, selectedSlotIndex) => {
  if (selectedSlotIndex === null) {
    return null;
  }

  return slots[selectedSlotIndex] ? selectedSlotIndex : null;
};

const reduceOpenContainer = (state, coordinateKey) => {
  const container = state.worldLoot[coordinateKey];

  if (!container) {
    return {
      nextState: state,
      result: { status: "missing", message: "There is nothing here." },
    };
  }

  if (container.opened || container.drops.length === 0) {
    return {
      nextState: {
        ...state,
        feedbackMessage: "This chest is empty.",
      },
      result: { status: "empty", message: "This chest is empty." },
    };
  }

  let nextSlots = state.slots.map(cloneSlot);
  const grantedDrops = [];
  const leftoverDrops = [];

  container.drops.forEach((drop) => {
    const addResult = addItemToSlots(nextSlots, drop.itemId, drop.quantity);
    nextSlots = addResult.nextSlots;

    if (addResult.addedQuantity > 0) {
      grantedDrops.push({ itemId: drop.itemId, quantity: addResult.addedQuantity });
    }

    if (addResult.leftoverQuantity > 0) {
      leftoverDrops.push({ itemId: drop.itemId, quantity: addResult.leftoverQuantity });
    }
  });

  const nextWorldLoot = {
    ...state.worldLoot,
    [coordinateKey]: {
      ...container,
      opened: leftoverDrops.length === 0,
      drops: leftoverDrops.map(cloneDrop),
    },
  };

  const message = getInventorySummary(grantedDrops, leftoverDrops);

  return {
    nextState: {
      ...state,
      slots: nextSlots,
      selectedSlotIndex: resolveInventorySelection(nextSlots, state.selectedSlotIndex),
      worldLoot: nextWorldLoot,
      feedbackMessage: message,
    },
    result: {
      status: grantedDrops.length > 0 ? "opened" : "full",
      message,
      grantedDrops,
      leftoverDrops,
    },
  };
};

const reduceUseSelectedItem = (state) => {
  if (state.selectedSlotIndex === null) {
    return {
      nextState: {
        ...state,
        feedbackMessage: "Select an item first.",
      },
      result: { status: "missing-selection", message: "Select an item first." },
    };
  }

  const selectedSlot = state.slots[state.selectedSlotIndex];

  if (!selectedSlot) {
    return {
      nextState: {
        ...state,
        selectedSlotIndex: null,
        feedbackMessage: "Select an item first.",
      },
      result: { status: "missing-selection", message: "Select an item first." },
    };
  }

  const item = getItemDefinition(selectedSlot.itemId);

  if (!item || item.kind !== "consumable") {
    return {
      nextState: {
        ...state,
        feedbackMessage: `${item?.name ?? "This item"} cannot be used this way.`,
      },
      result: {
        status: "not-usable",
        message: `${item?.name ?? "This item"} cannot be used this way.`,
      },
    };
  }

  const nextSlots = state.slots.map(cloneSlot);
  const nextSelectedSlot = nextSlots[state.selectedSlotIndex];

  if (nextSelectedSlot.quantity > 1) {
    nextSelectedSlot.quantity -= 1;
  } else {
    nextSlots[state.selectedSlotIndex] = null;
  }

  const message = `Used ${item.name}.`;

  return {
    nextState: {
      ...state,
      slots: nextSlots,
      selectedSlotIndex: resolveInventorySelection(nextSlots, state.selectedSlotIndex),
      feedbackMessage: message,
    },
    result: { status: "used", message, itemId: item.id },
  };
};

const inventoryReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_INVENTORY":
      return {
        ...state,
        isInventoryOpen: typeof action.payload === "boolean" ? action.payload : !state.isInventoryOpen,
      };
    case "SELECT_SLOT":
      return {
        ...state,
        selectedSlotIndex:
          action.payload !== null && state.slots[action.payload]
            ? action.payload
            : null,
      };
    case "OPEN_CONTAINER":
      return reduceOpenContainer(state, action.payload.coordinateKey).nextState;
    case "USE_SELECTED_ITEM":
      return reduceUseSelectedItem(state).nextState;
    case "CLEAR_FEEDBACK":
      return state.feedbackMessage ? { ...state, feedbackMessage: "" } : state;
    default:
      return state;
  }
};

export const InventoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(inventoryReducer, undefined, createInitialState);

  useEffect(() => {
    if (!state.feedbackMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: "CLEAR_FEEDBACK" });
    }, FEEDBACK_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [state.feedbackMessage]);

  const toggleInventory = useCallback((nextValue) => {
    dispatch({ type: "TOGGLE_INVENTORY", payload: nextValue });
  }, []);

  const selectSlot = useCallback((slotIndex) => {
    dispatch({ type: "SELECT_SLOT", payload: slotIndex });
  }, []);

  const openContainer = useCallback(
    (coordinateKey) => {
      const result = reduceOpenContainer(state, coordinateKey).result;
      dispatch({ type: "OPEN_CONTAINER", payload: { coordinateKey } });
      return result;
    },
    [state],
  );

  const useSelectedItem = useCallback(() => {
    const result = reduceUseSelectedItem(state).result;
    dispatch({ type: "USE_SELECTED_ITEM" });
    return result;
  }, [state]);

  const value = useMemo(
    () => ({
      itemDefinitions: ITEM_DEFINITIONS,
      slots: state.slots,
      selectedSlotIndex: state.selectedSlotIndex,
      isInventoryOpen: state.isInventoryOpen,
      worldLoot: state.worldLoot,
      feedbackMessage: state.feedbackMessage,
      toggleInventory,
      selectSlot,
      openContainer,
      useSelectedItem,
    }),
    [
      state.feedbackMessage,
      state.isInventoryOpen,
      state.selectedSlotIndex,
      state.slots,
      state.worldLoot,
      toggleInventory,
      selectSlot,
      openContainer,
      useSelectedItem,
    ],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};

export const useInventory = () => {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider.");
  }

  return context;
};
