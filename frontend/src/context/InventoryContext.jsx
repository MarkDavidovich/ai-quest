import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { INITIAL_INVENTORY, INITIAL_WORLD_LOOT, ITEM_DEFINITIONS } from "../utils/constants";

const InventoryContext = createContext(null);

const FEEDBACK_TIMEOUT_MS = 1800;

const cloneSlot = (slot) => (slot ? { ...slot } : null);
const cloneDrop = (drop) => ({ ...drop });

const createInitialState = (initialItems) => {

  let startingSlots = INITIAL_INVENTORY.map(() => null);

  if (initialItems && initialItems.length > 0) {
    initialItems.forEach((item, index) => {
      if (index < startingSlots.length) {
        startingSlots[index] = { itemId: item.name, quantity: item.quantity };
      }
    });
  } else {
    startingSlots = INITIAL_INVENTORY.map(cloneSlot);
  }

  return {
    slots: startingSlots,
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
  };

};

/* helper function indicate to tell which item availble and time counter*/
const getContainerDrops = (container, coordinateKey) => {
  const now = Date.now();
  const COOLDOWN_MS = 60000;
  if (!container.openedAt) {
    return { drops: container.drops, remainingSecs: 0 };
  }
  const timePassed = now - container.openedAt;
  if (timePassed < COOLDOWN_MS) {
    return { drops: [], remainingSecs: Math.ceil((COOLDOWN_MS - timePassed) / 1000) };
  }
  const originalLoot = INITIAL_WORLD_LOOT[coordinateKey];
  return { drops: originalLoot ? originalLoot.drops.map(cloneDrop) : [], remainingSecs: 0 };
};

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
    return { nextState: state, result: { status: "missing", message: "There is nothing here." } };
  }

  const { drops: currentDrops, remainingSecs } = getContainerDrops(container, coordinateKey);

  if (remainingSecs > 0) {
    const message = `Empty. Try again in ${remainingSecs}s.`;
    return { nextState: { ...state, feedbackMessage: message }, result: { status: "empty", message } };
  }

  if (currentDrops.length === 0) {
    return { nextState: { ...state, feedbackMessage: "This chest is empty." }, result: { status: "empty", message: "This chest is empty." } };
  }


  let nextSlots = state.slots.map(cloneSlot);
  const grantedDrops = [];
  const leftoverDrops = [];

  currentDrops.forEach((drop) => {
    const { nextSlots: updatedSlots, addedQuantity, leftoverQuantity } = addItemToSlots(nextSlots, drop.itemId, drop.quantity);
    nextSlots = updatedSlots;

    if (addedQuantity > 0) grantedDrops.push({ itemId: drop.itemId, quantity: addedQuantity });
    if (leftoverQuantity > 0) leftoverDrops.push({ itemId: drop.itemId, quantity: leftoverQuantity });
  });

  const isNowEmpty = leftoverDrops.length === 0;
  const message = getInventorySummary(grantedDrops, leftoverDrops);

  return {
    nextState: {
      ...state,
      slots: nextSlots,
      selectedSlotIndex: resolveInventorySelection(nextSlots, state.selectedSlotIndex),
      worldLoot: {
        ...state.worldLoot,
        [coordinateKey]: { ...container, opened: isNowEmpty, openedAt: isNowEmpty ? Date.now() : null, drops: leftoverDrops }
      },
      feedbackMessage: message,
    },
    result: { status: grantedDrops.length > 0 ? "opened" : "full", message, grantedDrops, leftoverDrops },
  };
}

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

// --- תוספת: פונקציית עזר להורדת חפץ ---
const reduceRemoveItem = (state, itemId, quantity) => {
  let remainingToRemove = quantity;
  const nextSlots = state.slots.map(cloneSlot);

  for (let i = 0; i < nextSlots.length; i++) {
    const slot = nextSlots[i];
    if (slot && slot.itemId === itemId) {
      if (slot.quantity > remainingToRemove) {
        slot.quantity -= remainingToRemove;
        remainingToRemove = 0;
        break;
      } else {
        remainingToRemove -= slot.quantity;
        nextSlots[i] = null; // מרוקן את הסלוט אם לקחנו הכל
      }
    }
  }

  return {
    ...state,
    slots: nextSlots,
    selectedSlotIndex: resolveInventorySelection(nextSlots, state.selectedSlotIndex),
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
    case "REMOVE_ITEM": // --- תוספת ---
      return reduceRemoveItem(state, action.payload.itemId, action.payload.quantity);
    case "CLEAR_FEEDBACK":
      return state.feedbackMessage ? { ...state, feedbackMessage: "" } : state;
    default:
      return state;
  }
};

export const InventoryProvider = ({ children, initialItems }) => {
  const [state, dispatch] = useReducer(inventoryReducer, initialItems, createInitialState);

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

  // --- תוספת: חשיפת פונקציית מחיקת חפץ לקומפוננטות אחרות ---
  const removeItem = useCallback((itemId, quantity = 1) => {
    dispatch({ type: "REMOVE_ITEM", payload: { itemId, quantity } });
  }, []);

  // --- תוספת: פונקציית בדיקה אם יש לנו מספיק מחפץ מסוים ---
  const hasItem = useCallback((itemId, quantity = 1) => {
    const total = state.slots.reduce((sum, slot) => {
      if (slot && slot.itemId === itemId) return sum + slot.quantity;
      return sum;
    }, 0);
    return total >= quantity;
  }, [state.slots]);

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
      removeItem, // נחשף
      hasItem,    // נחשף
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
      removeItem,
      hasItem,
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