import { useState, useEffect, useRef } from "react";
import GameViewport from "../GameViewport/GameViewport";
import GameUI from "../GameUI/GameUI";
import { GRID_WIDTH, GRID_HEIGHT, CAMERA_WIDTH, CAMERA_HEIGHT, WORLD_DATA, MOVE_DURATION } from "../../utils/constants";
import styles from "./Game.module.css";

export default function AdventureGame() {
  // SMOOTH MOVEMENT: Two position systems
  // playerGridPos = actual game position (for collision, logic)
  // playerDisplayPos = rendered position (smooth animation)
  const [playerGridPos, setPlayerGridPos] = useState({ x: 5, y: 5 });
  const [playerDisplayPos, setPlayerDisplayPos] = useState({ x: 5, y: 5 });

  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState("Use arrow keys to move. Explore!");
  const [isMoving, setIsMoving] = useState(false);
  const inputBuffer = useRef(null);
  const moveStartTime = useRef(0);
  const prevDisplayPos = useRef({ x: 5, y: 5 });

  // ============================================
  // SMOOTH MOVEMENT ANIMATION LOOP
  // ============================================
  useEffect(() => {
    let animationId;

    const animate = () => {
      if (isMoving) {
        // Calculate animation progress (0 to 1)
        const elapsed = Date.now() - moveStartTime.current;
        const progress = Math.min(elapsed / MOVE_DURATION, 1);

        // Apply easing function (ease-out cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        // Interpolate between old and new position
        const newX = prevDisplayPos.current.x + (playerGridPos.x - prevDisplayPos.current.x) * easeProgress;
        const newY = prevDisplayPos.current.y + (playerGridPos.y - prevDisplayPos.current.y) * easeProgress;

        setPlayerDisplayPos({ x: newX, y: newY });

        // Animation finished?
        if (progress >= 1) {
          setPlayerDisplayPos(playerGridPos);
          setIsMoving(false);

          // Process buffered input
          if (inputBuffer.current) {
            const buf = inputBuffer.current;
            inputBuffer.current = null;
            handleMove(buf.x, buf.y);
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isMoving, playerGridPos]);

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
  // CAMERA SYSTEM - FOLLOWS GRID POSITION
  // ============================================

  useEffect(() => {
    // Center camera on player GRID POSITION (not display)
    const cameraCenterX = CAMERA_WIDTH / 2;
    const cameraCenterY = CAMERA_HEIGHT / 2;

    let newCamX = playerGridPos.x - cameraCenterX;
    let newCamY = playerGridPos.y - cameraCenterY;

    // Clamp to world bounds
    newCamX = Math.max(0, Math.min(newCamX, GRID_WIDTH - CAMERA_WIDTH));
    newCamY = Math.max(0, Math.min(newCamY, GRID_HEIGHT - CAMERA_HEIGHT));

    setCameraPos({ x: newCamX, y: newCamY });
  }, [playerGridPos]); // Depend on GRID position, not display

  // ============================================
  // MOVEMENT HANDLER
  // ============================================

  const handleMove = (dx, dy) => {
    // If already moving, buffer the input
    if (isMoving) {
      inputBuffer.current = { x: dx, y: dy };
      return;
    }

    const newX = playerGridPos.x + dx;
    const newY = playerGridPos.y + dy;

    // Test if we can move (proposal system)
    if (canMoveTo(newX, newY)) {
      // Move is valid
      // SMOOTH MOVEMENT: Store previous display position
      prevDisplayPos.current = playerDisplayPos;

      // Update GRID position (instant)
      setPlayerGridPos({ x: newX, y: newY });
      setIsMoving(true);
      moveStartTime.current = Date.now();

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
  }, [isMoving, playerGridPos, playerDisplayPos]);

  return (
    <div className={styles.container}>
      <GameUI playerGridPos={playerGridPos} playerDisplayPos={playerDisplayPos} message={message} gridWidth={GRID_WIDTH} gridHeight={GRID_HEIGHT} />
      <GameViewport playerDisplayPos={playerDisplayPos} cameraPos={cameraPos} isMoving={isMoving} />
    </div>
  );
}
