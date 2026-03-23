import { useState } from "react";
import styles from "./Header.module.css";


const Header = () => {

  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  const toggleInventory = () => {
    setIsInventoryOpen(!isInventoryOpen);
  };


  return (<header className={styles.header}>
    <div className={styles.statsContainer}>
    <div className={styles.charInfo}>
          <span className={styles.name}>Hero</span>
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

      <nav className={styles.nav}>
        <button className={styles.navButton} onClick={toggleInventory}>
          Inventory
        </button>
        <button className={styles.navButton}>Quest</button>
        <button className={styles.navButton}>Map</button>
        <button className={styles.navButton}>Chat</button>
      </nav>

      {isInventoryOpen && (
        <div className={styles.inventoryPanel}>
          <div className={styles.inventoryHeader}>
            <h3>Inventory</h3>
            <button onClick={toggleInventory} className={styles.closeBtn}>X</button>
          </div>
          <div className={styles.grid}>
         
            {[...Array(12)].map((_, i) => (
              <div key={i} className={styles.slot}></div>
            ))}
          </div>
        </div>
      )}
    </header>);
};

export default Header;
