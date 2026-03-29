import { memo } from "react";
import styles from "./Tile.module.css";
import { UNIT_SIZE } from "../../utils/constants";
import { SPRITE_MAP } from "../../utils/tilesets";

const Tile = memo(({ type, x, y, cameraPos, centerOffsets = { x: 0, y: 0 }, category }) => {
  const screenX = (x - cameraPos.x + centerOffsets.x) * UNIT_SIZE;
  const screenY = (y - cameraPos.y + centerOffsets.y) * UNIT_SIZE;
  const spriteData = SPRITE_MAP[type];
  const widthUnits = spriteData?.widthUnits ?? 1;
  const heightUnits = spriteData?.heightUnits ?? 1;
  const anchorX = spriteData?.anchorX ?? 0;
  const anchorY = spriteData?.anchorY ?? 0;

  // Base positioning for exactly where on the screen this tile belongs
  let style = {
    left: screenX - anchorX * UNIT_SIZE,
    top: screenY - anchorY * UNIT_SIZE,
    width: widthUnits * UNIT_SIZE,
    height: heightUnits * UNIT_SIZE,
    "--unit-size": `${UNIT_SIZE}px`,
  };

  // ==========================================
  // 1. FLOOR LEVEL RENDERING
  // ==========================================
  if (category === "floor") {
    // If it's a pixel art sprite, render it cleanly with Vite!
    if (spriteData) {
       style = {
           ...style, 
           backgroundImage: `url(${spriteData.img})`,
           backgroundPosition: `${spriteData.posX} ${spriteData.posY || "0%"}`,
           backgroundSize: spriteData.size ?? `${spriteData.posY ? spriteData.size : "100%"} ${spriteData.posY ? spriteData.size : "100%"}`,
           backgroundRepeat: "no-repeat",
           backgroundColor: "transparent",
           imageRendering: "pixelated"
       };
       return <div className={`${styles.tile} ${styles.floor}`} style={style} />;
    }

    // Backward compability for strings like "water"
    let bgColor = "#4a7c59"; // Grass default
    if (type === "water") bgColor = "#2a5a7f";
    else if (type === "stone") bgColor = "#5c5c5c";
    else if (type === 2) bgColor = "#7a7a7a"; // Old numeric stone type

    return <div className={`${styles.tile} ${styles.floor}`} style={{ ...style, backgroundColor: bgColor }} />;
  }

  // ==========================================
  // 2. COLLISION / INTERACTIVE LAYER RENDERING
  // ==========================================
  if (category === "interactive" && spriteData) {
    style = {
      ...style,
      backgroundImage: `url(${spriteData.img})`,
      backgroundPosition: `${spriteData.posX} ${spriteData.posY || "0%"}`,
      backgroundSize: spriteData.size ?? `${spriteData.posY ? spriteData.size : "100%"} ${spriteData.posY ? spriteData.size : "100%"}`,
      backgroundRepeat: "no-repeat",
      backgroundColor: "transparent",
      imageRendering: "pixelated",
    };
    return <div className={`${styles.tile} ${styles.object}`} style={style} />;
  }

  let content = null;

  if (category === "object") {
     // If it's a known pixel-art object, render its bounds and RETURN!
     if (spriteData) {
       style = {
           ...style, 
           backgroundImage: `url(${spriteData.img})`,
           backgroundPosition: `${spriteData.posX} ${spriteData.posY || "0%"}`,
           backgroundSize: spriteData.size ?? `${spriteData.posY ? spriteData.size : "100%"} ${spriteData.posY ? spriteData.size : "100%"}`,
           backgroundRepeat: "no-repeat",
           backgroundColor: "transparent",
           imageRendering: "pixelated"
       };
       return <div className={`${styles.tile} ${styles.object}`} style={style} />;
     }

    // Legacy Emojis
    if (type === "tree") content = "🌲";
    else if (type === "house") content = "🏠";
    else if (type === "npc") content = "💃";
  } else if (category === "interactive") {
    if (type === 1) content = "📦";
  }

  // If there's no emoji content mapped, skip it.
  if (!content) return null;

  return (
    <div className={`${styles.tile} ${styles.object}`} style={style}>
      {content}
    </div>
  );
});

export default Tile;
