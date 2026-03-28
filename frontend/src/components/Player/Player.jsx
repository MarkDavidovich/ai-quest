import React, { useState, useEffect } from "react";
import style from "./Player.module.css";
import { UNIT_SIZE } from "../../utils/constants";
import { SPRITE_MAP } from "../../utils/tilesets";

const Player = ({ x, y, cameraPos, centerOffsets = { x: 0, y: 0 }, facingDir, isMoving }) => {
  const [frameIndex, setFrameIndex] = useState(0);

  // Use the display position (smooth animation) for rendering
  const playerScreenX = (x - cameraPos.x + centerOffsets.x) * UNIT_SIZE;
  const playerScreenY = (y - cameraPos.y + centerOffsets.y) * UNIT_SIZE;

  // Animation Frame Loop
  useEffect(() => {
    if (!isMoving) {
        setFrameIndex(0); // Reset to neutral frame
        return;
    }

    // Faster interval ensures we see the animation during the short MOVE_DURATION (150ms)
    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % 4); 
    }, 45);

    return () => clearInterval(interval);
  }, [isMoving]);

  const getSpriteKey = () => {
    const { x, y } = facingDir;
    const prefix = isMoving ? "playerWalking" : "playerIdle";

    if (y < 0) return `${prefix}Up`;
    if (y > 0) return `${prefix}Down`;
    if (x < 0) return `${prefix}Left`;
    if (x > 0) return `${prefix}Right`;

    return `${prefix}Down`;
  };

  const spriteKey = getSpriteKey();
  const spriteData = SPRITE_MAP[spriteKey];

  // Logic: 0 -> Row 1 (Neutral), 1 -> Row 0, 2 -> Row 1, 3 -> Row 2
  const rowOrder = [1, 0, 1, 2];
  const currentRow = isMoving ? rowOrder[frameIndex] : 0;
  
  // Important: If we are walking, we must tell the background-size we have 3 rows!
  const rowsInSheet = isMoving ? 3 : 1;
  const frameY = rowsInSheet > 1 ? (currentRow / (rowsInSheet - 1)) * 100 : 0;

  const playerStyle = {
    left: playerScreenX,
    top: playerScreenY,
    "--unit-size": `${UNIT_SIZE}px`,
    backgroundImage: spriteData ? `url(${spriteData.img})` : "none",
    backgroundPosition: spriteData ? `${spriteData.posX} ${frameY}%` : "0% 0%",
    backgroundSize: spriteData ? `${spriteData.size} ${rowsInSheet * 100}%` : "100% 100%",
    imageRendering: "pixelated",
    backgroundRepeat: "no-repeat",
    zIndex: 10,
  };

  return <div className={style.player} style={playerStyle} />;
};

export default Player;
