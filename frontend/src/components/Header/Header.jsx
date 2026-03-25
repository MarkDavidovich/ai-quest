import styles from "./Header.module.css";
import { useInventory } from "../../context/InventoryContext";
import { useAuth } from "../../context/AuthContext";
import { CAMERA_WIDTH, UNIT_SIZE } from "../../utils/constants";

const Header = ({ isBattle = false }) => {
  const {
    itemDefinitions,
    slots,
    selectedSlotIndex,
    isInventoryOpen,
    toggleInventory,
    selectSlot,
    useSelectedItem,
  } = useInventory();

  const { user, logout } = useAuth();

  const handleInventoryToggle = () => {
    toggleInventory();
  };

  const handleSlotClick = (slotIndex, hasItem) => {
    if (!hasItem) {
      selectSlot(null);
      return;
    }

    selectSlot(selectedSlotIndex === slotIndex ? null : slotIndex);
  };

  const selectedSlot = selectedSlotIndex !== null ? slots[selectedSlotIndex] : null;
  const selectedItem = selectedSlot ? itemDefinitions[selectedSlot.itemId] : null;
  const gameWidth = `${CAMERA_WIDTH * UNIT_SIZE}px`;

  return (
    <header
      className={styles.header}
      style={{
        width: gameWidth,
        minWidth: gameWidth,
        maxWidth: gameWidth,
      }}
    >
      <div className={styles.statsContainer}>
        <div className={styles.charInfo}>
          <span className={styles.name}>{user ? `${user.firstName} ${user.lastName}` : "Hero"}</span>
          <span className={styles.level}>Lv. 1</span>
        </div>

        <div className={styles.bars}>
          <div className={styles.barWrapper}>
            <span className={styles.barLabel}>HP: 100 / 100</span>
            <div className={`${styles.bar} ${styles.hpBar}`}></div>
          </div>
          <div className={styles.barWrapper}>
            <span className={styles.barLabel}>MP: 50 / 50</span>
            <div className={`${styles.bar} ${styles.mpBar}`}></div>
          </div>
        </div>
      </div>

      {isBattle ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f6c63d",
            fontSize: "2.4rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Battle
        </div>
      ) : (
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${isInventoryOpen ? styles.activeButton : ""}`}
            type="button"
            onClick={handleInventoryToggle}
          >
            Inventory
          </button>
          <button className={styles.navButton} type="button">
            Quest
          </button>
          <button className={styles.navButton} type="button">
            Map
          </button>
          <button className={styles.navButton} type="button">
            Chat
          </button>
          <button
            className={`${styles.navButton} ${styles.logoutButton}`}
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      )}

      {!isBattle && isInventoryOpen && (
        <div className={styles.inventoryPanel}>
          <div className={styles.inventoryHeader}>
            <h3>Inventory</h3>
            <button type="button" onClick={handleInventoryToggle} className={styles.closeBtn}>
              X
            </button>
          </div>
          <div className={styles.grid}>
            {slots.map((slot, index) => {
              const item = slot ? itemDefinitions[slot.itemId] : null;
              const isSelected = index === selectedSlotIndex;

              return (
                <button
                  key={index}
                  type="button"
                  className={`${styles.slot} ${isSelected ? styles.selectedSlot : ""}`}
                  onClick={() => handleSlotClick(index, Boolean(slot))}
                  aria-pressed={isSelected}
                >
                  {item ? <span className={styles.slotIcon}>{item.icon}</span> : null}
                  {slot && slot.quantity > 1 ? <span className={styles.slotQuantity}>{slot.quantity}</span> : null}
                </button>
              );
            })}
          </div>
          <div className={styles.inventoryActions}>
            <p className={styles.selectionLabel}>
              {selectedItem ? `Selected: ${selectedItem.name}` : "Selected: none"}
            </p>
            <button
              type="button"
              className={styles.useItemButton}
              onClick={useSelectedItem}
              disabled={!selectedSlot}
            >
              Use Item
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
