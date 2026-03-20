import { useState, useEffect, useRef } from "react";
import GameViewport from "../GameViewport/GameViewport";
import GameUI from "../GameUI/GameUI";
import { GRID_WIDTH, GRID_HEIGHT, CAMERA_WIDTH, CAMERA_HEIGHT, WORLD_DATA } from "../../utils/constants";
import styles from "./Game.module.css";

export default function AdventureGame() {
  // Game state
  const [playerPos, setPlayerPos] = useState({ x: 5, y: 5 });
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState("Use arrow keys to move. Explore!");
  const [isMoving, setIsMoving] = useState(false);
  const inputBuffer = useRef(null);

  // ============================================
  // COLLISION DETECTION
  // ============================================

  const canMoveTo = (x, y) => {
    // Out of bounds?
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
    // Solid object there?
    if (WORLD_DATA.objects[y]?.[x] !== 0) return false;
    return true;
  };

  // Check what interactive item is at position
  const getInteractiveAt = (x, y) => {
    return WORLD_DATA.interactive[y]?.[x] || 0;
  };

  // ============================================
  // CAMERA SYSTEM
  // ============================================

  useEffect(() => {
    // Center camera on player
    const cameraCenterX = CAMERA_WIDTH / 2;
    const cameraCenterY = CAMERA_HEIGHT / 2;

    let newCamX = playerPos.x - cameraCenterX;
    let newCamY = playerPos.y - cameraCenterY;

    // Clamp to world bounds
    newCamX = Math.max(0, Math.min(newCamX, GRID_WIDTH - CAMERA_WIDTH));
    newCamY = Math.max(0, Math.min(newCamY, GRID_HEIGHT - CAMERA_HEIGHT));

    setCameraPos({ x: newCamX, y: newCamY });
  }, [playerPos]);

  // ============================================
  // MOVEMENT HANDLER
  // ============================================

  const handleMove = (dx, dy) => {
    // If already moving, buffer the input
    if (isMoving) {
      inputBuffer.current = { x: dx, y: dy };
      return;
    }

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Test if we can move (proposal system)
    if (canMoveTo(newX, newY)) {
      // Move is valid
      setPlayerPos({ x: newX, y: newY });
      setIsMoving(true);

      // Animation duration
      setTimeout(() => {
        setIsMoving(false);

        // Process buffered input
        if (inputBuffer.current) {
          const buf = inputBuffer.current;
          inputBuffer.current = null;
          handleMove(buf.x, buf.y);
        }
      }, 150);

      // Check what we're standing on
      const interactive = getInteractiveAt(newX, newY);
      if (interactive === 1) {
        setMessage("🎁 You found a treasure chest!");
      } else if (interactive === 2) {
        setMessage("🧙 You met a wanderer!");
      } else {
        setMessage("");
      }
    } else {
      // Move is blocked
      setMessage("🚫 Blocked by an obstacle!");
      setTimeout(() => setMessage(""), 1000);
    }
  };

  // ============================================
  // KEYBOARD INPUT
  // ============================================

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        handleMove(0, -1);
        e.preventDefault();
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        handleMove(0, 1);
        e.preventDefault();
      }
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        handleMove(-1, 0);
        e.preventDefault();
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        handleMove(1, 0);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMoving, playerPos]);

  return (
    <div className={styles.container}>
      <GameUI playerPos={playerPos} message={message} gridWidth={GRID_WIDTH} gridHeight={GRID_HEIGHT} />
      <GameViewport playerPos={playerPos} cameraPos={cameraPos} isMoving={isMoving} />
    </div>
  );
}
