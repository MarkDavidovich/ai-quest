import React from "react";
import styles from "./Player.module.css";
import { UNIT_SIZE } from "../../utils/constants";

const Player = ({ x, y, cameraPos, facingDir }) => {
  // Use the display position (smooth animation) for rendering
  const playerScreenX = (x - cameraPos.x) * UNIT_SIZE;
  const playerScreenY = (y - cameraPos.y) * UNIT_SIZE;

  //TODO implement facing direction to change sprites
  //TODO CHECK WHY THIS DOESN'T WORK

  const getSprite = () => {
    const { x, y } = facingDir;

    if (y < 0) return "🧍‍♂️"; // Up
    if (y > 0) return "🧍"; // Down
    if (x < 0) return "🚶‍♂️"; // Left
    if (x > 0) return "🚶‍♂️‍➡️"; // Right

    return "🧙‍♂️";
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
      {getSprite()}
    </div>
  );
};

export default Player;
