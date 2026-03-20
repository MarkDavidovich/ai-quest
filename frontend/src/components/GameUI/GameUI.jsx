import React from "react";
import styles from "./GameUI.module.css";

const GameUI = ({ playerPos, message, gridWidth, gridHeight }) => {
  return (
    <>
      <h2 style={{ marginTop: 0, marginBottom: "8px" }}>🎮 Adventure Game (CSS)</h2>
      <p style={{ margin: "0 0 16px", color: "#666", fontSize: "14px" }}>Use arrow keys or WASD to move. Explore the world!</p>

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
