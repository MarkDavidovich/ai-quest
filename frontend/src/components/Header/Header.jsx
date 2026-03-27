import styles from "./Header.module.css";
import { useInventory } from "../../context/InventoryContext";
import { useAuth } from "../../context/AuthContext";
import { CAMERA_WIDTH, UNIT_SIZE, PLAYER_STATS } from "../../utils/constants";
import { useNavigate } from "react-router-dom";


const Header = ({ isBattle = false, playerHp = 100, onUseItem, onSave }) => {
  const { itemDefinitions, slots, selectedSlotIndex, isInventoryOpen, toggleInventory, selectSlot, useSelectedItem } = useInventory();
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleInventoryToggle = () => {
    toggleInventory();
  };

  const handleItemUsage = () => {
    const result = useSelectedItem();
    if (result.status === "used") {
      onUseItem?.(result.itemId);
    }
  };

  const handleSlotClick = (slotIndex, hasItem) => {
    if (!hasItem) {
      selectSlot(null);
      return;
    }

    selectSlot(selectedSlotIndex === slotIndex ? null : slotIndex);
  };

  const handleSaveClick = () => {
    console.log("1. Save button clicked!");
    console.log("2. Does onSave exist?", Boolean(onSave));

    const inventoryToSave = slots
      .filter((slot) => slot !== null)
      .map((slot) => ({
        name: slot.itemId,
        quantity: slot.quantity
      }));

    if (onSave) {
      console.log("3. Calling onSave with inventory:", inventoryToSave);
      onSave(inventoryToSave)
    } else {
      alert("שגיאה בדיבוג: הפרופ onSave חסר! הוא לא הגיע מ-GamePage.");
    }
  };

  const selectedSlot = selectedSlotIndex !== null ? slots[selectedSlotIndex] : null;
  const selectedItem = selectedSlot ? itemDefinitions[selectedSlot.itemId] : null;
  const gameWidth = `${CAMERA_WIDTH * UNIT_SIZE}px`;

  // Calculate HP percentage
  const hpPercent = Math.max(0, Math.min(100, (playerHp / PLAYER_STATS.maxHp) * 100));

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
          {!isBattle && (
            <>
              <span className={styles.name}>{user ? `${user.firstName} ${user.lastName}` : "Hero"}</span>
              <span className={styles.level}>Lv. 1</span>
            </>
          )}
        </div>

        {!isBattle && (
          <div className={styles.bars}>
            <div className={styles.barWrapper}>
              <span className={styles.barLabel}>
                HP: {playerHp} / {PLAYER_STATS.maxHp}
              </span>
              <div className={`${styles.bar} ${styles.hpBar}`} style={{ width: `${hpPercent}%` }}></div>
            </div>
            <div className={styles.barWrapper}>
              <span className={styles.barLabel}>MP: 50 / 50</span>
              <div className={`${styles.bar} ${styles.mpBar}`} style={{ width: `100%` }}></div>
            </div>
          </div>
        )}
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
          <>
            <button className={`${styles.navButton} ${isInventoryOpen ? styles.activeButton : ""}`} type="button" onClick={handleInventoryToggle}>
              Inventory
            </button>
            <button className={styles.navButton} type="button">
              Quest
            </button>
            <button className={styles.navButton} type="button" onClick={handleSaveClick}>
              Save game
            </button>
            <button className={styles.navButton} type="button" onClick={() => navigate("/menu")}>
              Quit
            </button>
          </>

          <button className={`${styles.navButton} ${styles.logoutButton}`} type="button" onClick={logout}>
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
            <p className={styles.selectionLabel}>{selectedItem ? `Selected: ${selectedItem.name}` : "Selected: none"}</p>
            <button type="button" className={styles.useItemButton} onClick={handleItemUsage} disabled={!selectedSlot}>
              Use Item
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
