import React from "react";
import styles from "./GameUI.module.css";

const GameUI = ({ playerPos, message, gridWidth, gridHeight }) => {
  return (
    <>
      <div className={styles.statusDisplay}>
        <p className={styles.statusText}>
          <strong>Position:</strong> ({playerPos.x}, {playerPos.y}) |<strong style={{ marginLeft: "12px" }}>World:</strong> {gridWidth}×{gridHeight} tiles
        </p>
        <p className={styles.message}>{message}</p>
      </div>
    </>
  );
};

export default GameUI;
