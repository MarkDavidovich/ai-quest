import { memo } from "react";
import styles from "./Tile.module.css";
import { UNIT_SIZE } from "../../utils/constants";

const Tile = memo(({ type, x, y, cameraPos, centerOffsets = { x: 0, y: 0 }, category }) => {
  const screenX = (x - cameraPos.x + centerOffsets.x) * UNIT_SIZE;
  const screenY = (y - cameraPos.y + centerOffsets.y) * UNIT_SIZE;

  const style = {
    left: screenX,
    top: screenY,
    "--unit-size": `${UNIT_SIZE}px`,
  };

  if (category === "floor") {
    let bgColor = "#4a7c59"; // Grass default
    if (type === "water") bgColor = "#2a5a7f";
    else if (type === "stone") bgColor = "#5c5c5c";
    else if (type === 2) bgColor = "#7a7a7a"; // Old numeric stone type

    return <div className={`${styles.tile} ${styles.floor}`} style={{ ...style, backgroundColor: bgColor }} />;
  }

  let content = null;
  if (category === "object") {
    if (type === "tree") content = "🌲";
    else if (type === "house") content = "🏠";
    else if (type === "npc") content = "💃";
  } else if (category === "interactive") {
    if (type === 1) content = "📦";
  }

  if (!content) return null;

  return (
    <div className={`${styles.tile} ${styles.object}`} style={style}>
      {content}
    </div>
  );
});

export default Tile;
