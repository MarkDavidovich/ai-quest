import React from "react";
import styles from "./Player.module.css";
import { UNIT_SIZE } from "../../utils/constants";

const Player = ({ x, y, cameraPos, facingDir }) => {
  // Use the display position (smooth animation) for rendering
  const playerScreenX = (x - cameraPos.x) * UNIT_SIZE;
  const playerScreenY = (y - cameraPos.y) * UNIT_SIZE;

  //TODO implement facing direction to change sprites
  //TODO CHECK WHY THIS DOESN'T WORK

  const animateFacingDir = () => {
    switch (facingDir) {
      case { x: 0, y: -1 }:
        return "🧍‍♂️";
      case { x: 0, y: 1 }:
        return "🧍";
      case { x: -1, y: 0 }:
        return "🚶‍♂️";
      case { x: 1, y: 0 }:
        return "🚶‍♂️‍➡️";
      default:
        return "🧙‍♂️";
    }
  };

  return (
    <div
      className={styles.player}
      style={{
        left: playerScreenX,
        top: playerScreenY,
        "--unit-size": `${UNIT_SIZE}px`,
      }}
    >
      {animateFacingDir()}
    </div>
  );
};

export default Player;
