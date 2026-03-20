import React from "react";
import styles from "./Player.module.css";
import { UNIT_SIZE } from "../../utils/constants";

const Player = ({ x, y, cameraPos, isMoving }) => {
  const playerScreenX = (x - cameraPos.x) * UNIT_SIZE;
  const playerScreenY = (y - cameraPos.y) * UNIT_SIZE;

  return (
    <div
      className={`${styles.player} ${isMoving ? styles.moving : styles.static}`}
      style={{
        left: playerScreenX,
        top: playerScreenY,
        "--unit-size": `${UNIT_SIZE}px`,
      }}
    >
      🧙‍♂️
    </div>
  );
};

export default Player;
