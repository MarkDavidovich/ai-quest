import { useState } from "react";
import styles from "./Header.module.css";
import { useInventory } from "../../context/InventoryContext";
import { useAuth } from "../../context/AuthContext";
import { PLAYER_STATS } from "../../utils/constants";
import { SPRITE_MAP } from "../../utils/tilesets";
import { useNavigate } from "react-router-dom";

const Header = ({ isBattle = false, playerHp = 100, onUseItem, onSave, compactMenu = false }) => {
  const { itemDefinitions, slots, selectedSlotIndex, isInventoryOpen, toggleInventory, selectSlot, useSelectedItem } = useInventory();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
    const inventoryToSave = slots
      .filter((slot) => slot !== null)
      .map((slot) => ({
        name: slot.itemId,
        quantity: slot.quantity,
      }));

    if (onSave) {
      onSave(inventoryToSave);
      return;
    }

    alert("Save is currently unavailable.");
  };

  const handleSaveAndClose = () => {
    handleSaveClick();
    if (compactMenu) {
      closeMenu();
    }
  };

  const handleQuit = () => {
    closeMenu();
    navigate("/menu");
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  const selectedSlot = selectedSlotIndex !== null ? slots[selectedSlotIndex] : null;
  const selectedItem = selectedSlot ? itemDefinitions[selectedSlot.itemId] : null;
  const hpPercent = Math.max(0, Math.min(100, (playerHp / PLAYER_STATS.maxHp) * 100));

  const renderStats = (isCompact = false) => (
    <div className={`${styles.statsContainer} ${isCompact ? styles.statsContainerCompact : ""}`}>
      <div className={styles.charInfo}>
        {!isBattle && (
          <>
            <span className={styles.name}>{user ? `${user.firstName}` : "Hero"}</span>
            <span className={styles.level}></span>
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
        </div>
      )}
    </div>
  );

  const renderInventoryPanel = (isCompact = false) => (
    <div className={`${styles.inventoryPanel} ${isCompact ? styles.inventoryPanelMobile : ""}`}>
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
              {item ? (
                <span className={styles.slotIcon}>
                  {SPRITE_MAP[item.icon] ? (
                    <div
                      className={styles.spriteIcon}
                      style={{
                        backgroundImage: `url(${SPRITE_MAP[item.icon].img})`,
                        backgroundPosition: `${SPRITE_MAP[item.icon].posX} ${SPRITE_MAP[item.icon].posY || "0%"}`,
                        backgroundSize: SPRITE_MAP[item.icon].size,
                      }}
                    />
                  ) : (
                    item.icon
                  )}
                </span>
              ) : null}
              {slot && slot.quantity > 1 ? <span className={styles.slotQuantity}>{slot.quantity}</span> : null}
            </button>
          );
        })}
      </div>
      <div className={styles.inventoryActions}>
        <p className={styles.selectionLabel}>{selectedItem ? `Selected: ${selectedItem.name}` : ""}</p>
        <button type="button" className={styles.useItemButton} onClick={handleItemUsage} disabled={!selectedSlot}>
          Use Item
        </button>
      </div>
    </div>
  );

  const renderNavigation = (isCompact = false) => (
    <nav className={`${styles.nav} ${isCompact ? styles.navCompact : ""}`}>
      <button className={`${styles.navButton} ${isInventoryOpen ? styles.activeButton : ""}`} type="button" onClick={handleInventoryToggle}>
        Inventory
      </button>
      <button className={styles.navButton} type="button" onClick={handleSaveAndClose}>
        Save game
      </button>
      <button className={styles.navButton} type="button" onClick={handleQuit}>
        Quit
      </button>
      <button className={`${styles.navButton} ${styles.logoutButton}`} type="button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );

  if (compactMenu) {
    return (
      <>
        <button
          type="button"
          className={`${styles.menuTrigger} ${isMenuOpen ? styles.menuTriggerActive : ""}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <span className={styles.menuTriggerBar}></span>
          <span className={styles.menuTriggerBar}></span>
          <span className={styles.menuTriggerBar}></span>
        </button>

        <div
          className={`${styles.mobileMenuBackdrop} ${isMenuOpen ? styles.mobileMenuBackdropVisible : ""}`}
          onClick={closeMenu}
          aria-hidden={!isMenuOpen}
        ></div>

        <aside className={`${styles.mobileDrawer} ${isMenuOpen ? styles.mobileDrawerOpen : ""}`} aria-hidden={!isMenuOpen}>
          <div className={styles.mobileDrawerHeader}>
            <div>
              <p className={styles.mobileDrawerEyebrow}>Adventure Menu</p>
            </div>
            <button type="button" className={styles.mobileDrawerClose} onClick={closeMenu}>
              Close
            </button>
          </div>

          {renderStats(true)}

          {isBattle ? (
            <div className={styles.mobileBattleLabel}>Battle in progress</div>
          ) : (
            <>
              {renderNavigation(true)}
              {isInventoryOpen && renderInventoryPanel(true)}
            </>
          )}
        </aside>
      </>
    );
  }

  return (
    <header className={styles.header}>
      {renderStats()}

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
        renderNavigation()
      )}

      {!isBattle && isInventoryOpen && renderInventoryPanel()}
    </header>
  );
};

export default Header;
