import React from "react";
import styles from "./Tile.module.css";
import { UNIT_SIZE } from "../../utils/constants";

const Tile = ({ type, x, y, cameraPos, category }) => {
  const screenX = (x - cameraPos.x) * UNIT_SIZE;
  const screenY = (y - cameraPos.y) * UNIT_SIZE;

  const style = {
    left: screenX,
    top: screenY,
    "--unit-size": `${UNIT_SIZE}px`,
  };

  if (category === "floor") {
    const bgColor = type === 0 ? "#4a7c59" : type === 1 ? "#2a5a7f" : "#7a7a7a";
    return <div className={`${styles.tile} ${styles.floor}`} style={{ ...style, backgroundColor: bgColor }} />;
  }

  let content = null;
  if (category === "object") {
    if (type === 1) content = "🌲";
    else if (type === 2) content = "🏠";
    else if (type === 3) content = "🪨";
  } else if (category === "interactive") {
    if (type === 1) content = "📦";
    else if (type === 2) content = "🧙‍♀️";
  }

  if (!content) return null;

  return (
    <div className={`${styles.tile} ${styles.object}`} style={style}>
      {content}
    </div>
  );
};

export default Tile;
