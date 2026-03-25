import React from "react";
import style from "./Player.module.css";
import { UNIT_SIZE } from "../../utils/constants";

const Player = ({ x, y, cameraPos, centerOffsets = { x: 0, y: 0 }, facingDir }) => {
  // Use the display position (smooth animation) for rendering
  const playerScreenX = (x - cameraPos.x + centerOffsets.x) * UNIT_SIZE;
  const playerScreenY = (y - cameraPos.y + centerOffsets.y) * UNIT_SIZE;

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
      className={style.player}
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
