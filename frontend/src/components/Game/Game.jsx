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
  const [displayCameraPos, setDisplayCameraPos] = useState({ x: 0, y: 0 });

  const [message, setMessage] = useState("Use arrow keys to move. Explore!");
  const [isMoving, setIsMoving] = useState(false);
  const [facingDir, setFacingDir] = useState({ x: 1, y: 0 });

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
  }, [isMoving, playerGridPos, facingDir]);

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

  // Check what tile is at position x, y
  const getTileAt = (x, y, tileType = "objects") => {
    return WORLD_DATA[tileType][y]?.[x] || 0;
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

  // smooth camera
  useEffect(() => {
    let animationId;
    const cameraSpeed = 0.1; // Adjust between 0.05 (slower) to 0.2 (faster)

    const animateCamera = () => {
      setDisplayCameraPos((prev) => ({
        x: prev.x + (cameraPos.x - prev.x) * cameraSpeed,
        y: prev.y + (cameraPos.y - prev.y) * cameraSpeed,
      }));

      animationId = requestAnimationFrame(animateCamera);
    };

    animationId = requestAnimationFrame(animateCamera);
    return () => cancelAnimationFrame(animationId);
  }, [cameraPos]);

  // ============================================
  // MOVEMENT HANDLER
  // ============================================

  const handleMove = (dx, dy) => {
    // Update facing direction
    setFacingDir({ x: dx, y: dy });

    // Don't move if already moving (COOLDOWN)
    if (isMoving) return;

    const newX = playerGridPos.x + dx;
    const newY = playerGridPos.y + dy;

    // Check collision
    if (!canMoveTo(newX, newY)) {
      setMessage("🚫 Blocked by an obstacle!");
      setTimeout(() => setMessage(""), 1000);
      return;
    }

    // Move is valid
    prevDisplayPos.current = playerDisplayPos;
    setPlayerGridPos({ x: newX, y: newY });
    setIsMoving(true);
    moveStartTime.current = Date.now();

    // Check for interactive tiles
    const interactive = getTileAt(newX, newY, "interactive");
    if (interactive === 1) {
      setMessage("🎁 You found a treasure chest!");
    } else if (interactive === 2) {
      setMessage("🧙 You met a wanderer!");
    } else {
      setMessage("");
    }
  };

  // ============================================
  // ACTION HANDLER
  // ============================================

  const handleAction = () => {
    const targetX = playerGridPos.x + facingDir.x;
    const targetY = playerGridPos.y + facingDir.y;

    const objectAtTarget = getTileAt(targetX, targetY);

    if (objectAtTarget === "npc") {
      setMessage("NPC: Hello traveler! stay safe.");
    } else if (objectAtTarget !== "npc" && objectAtTarget !== 0) {
      setMessage(`Can't go this way, it's blocked by a ${objectAtTarget}!`);
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
      if (e.key === "Enter") {
        handleAction();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMoving, playerGridPos, playerDisplayPos, facingDir]);

  return (
    <div className={styles.container}>
      <GameUI
        playerGridPos={playerGridPos}
        playerDisplayPos={playerDisplayPos}
        message={message}
        gridWidth={GRID_WIDTH}
        gridHeight={GRID_HEIGHT}
        facingDir={facingDir}
      />
      <GameViewport playerDisplayPos={playerDisplayPos} cameraPos={displayCameraPos} isMoving={isMoving} facingDir={facingDir} />
    </div>
  );
}
