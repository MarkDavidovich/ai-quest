import React, { useState, useEffect, useRef } from "react";

const UNIT_SIZE = 32;
const GRID_WIDTH = 40;
const GRID_HEIGHT = 24;
const CAMERA_WIDTH = 20;
const CAMERA_HEIGHT = 12;

// World data - simple 2D arrays
const WORLD_DATA = {
  floor: Array(GRID_HEIGHT)
    .fill(null)
    .map((_, row) =>
      Array(GRID_WIDTH)
        .fill(null)
        .map((_, col) => {
          if ((row >= 6 && row <= 8 && col >= 8 && col <= 12) || (row >= 16 && row <= 18 && col >= 24 && col <= 28)) return 1; // water
          if (row >= 3 && row <= 4 && col >= 30 && col <= 35) return 2; // stone
          return 0; // grass
        }),
    ),

  objects: Array(GRID_HEIGHT)
    .fill(null)
    .map((_, row) =>
      Array(GRID_WIDTH)
        .fill(null)
        .map((_, col) => {
          // Trees
          if (
            (row === 2 && col === 3) ||
            (row === 5 && col === 6) ||
            (row === 10 && col === 4) ||
            (row === 14 && col === 8) ||
            (row === 3 && col === 15) ||
            (row === 8 && col === 18) ||
            (row === 12 && col === 22) ||
            (row === 6 && col === 32) ||
            (row === 18 && col === 14) ||
            (row === 20 && col === 35)
          )
            return 1;
          // Houses
          if ((row === 2 && col === 20) || (row === 11 && col === 15) || (row === 18 && col === 5)) return 2;
          // Rocks
          if ((row === 9 && col === 10) || (row === 15 && col === 20) || (row === 7 && col === 25) || (row === 21 && col === 10)) return 3;
          return 0;
        }),
    ),

  interactive: Array(GRID_HEIGHT)
    .fill(null)
    .map((_, row) =>
      Array(GRID_WIDTH)
        .fill(null)
        .map((_, col) => {
          if ((row === 4 && col === 22) || (row === 13 && col === 28) || (row === 20 && col === 16)) return 1; // chest
          if ((row === 3 && col === 25) || (row === 17 && col === 8)) return 2; // npc
          return 0;
        }),
    ),
};

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

  // ============================================
  // RENDER - Build tile list
  // ============================================
  const tiles = [];

  // Render floor tiles (only visible ones)
  const renderStartX = Math.max(0, Math.floor(cameraPos.x));
  const renderEndX = Math.min(GRID_WIDTH, Math.ceil(cameraPos.x + CAMERA_WIDTH));
  const renderStartY = Math.max(0, Math.floor(cameraPos.y));
  const renderEndY = Math.min(GRID_HEIGHT, Math.ceil(cameraPos.y + CAMERA_HEIGHT));

  for (let y = renderStartY; y < renderEndY; y++) {
    for (let x = renderStartX; x < renderEndX; x++) {
      const floorType = WORLD_DATA.floor[y][x];
      const bgColor = floorType === 0 ? "#4a7c59" : floorType === 1 ? "#2a5a7f" : "#7a7a7a";
      const screenX = (x - cameraPos.x) * UNIT_SIZE;
      const screenY = (y - cameraPos.y) * UNIT_SIZE;

      tiles.push(
        <div
          key={`floor-${x}-${y}`}
          style={{
            position: "absolute",
            left: screenX,
            top: screenY,
            width: UNIT_SIZE,
            height: UNIT_SIZE,
            backgroundColor: bgColor,
            border: "1px solid #333",
            boxSizing: "border-box",
          }}
        />,
      );
    }
  }

  // Render objects (trees, houses, rocks)
  for (let y = renderStartY; y < renderEndY; y++) {
    for (let x = renderStartX; x < renderEndX; x++) {
      const objType = WORLD_DATA.objects[y][x];
      if (objType === 0) continue;

      const screenX = (x - cameraPos.x) * UNIT_SIZE;
      const screenY = (y - cameraPos.y) * UNIT_SIZE;

      if (objType === 1) {
        // Tree
        tiles.push(
          <div
            key={`tree-${x}-${y}`}
            style={{
              position: "absolute",
              left: screenX,
              top: screenY,
              width: UNIT_SIZE,
              height: UNIT_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            🌲
          </div>,
        );
      } else if (objType === 2) {
        // House
        tiles.push(
          <div
            key={`house-${x}-${y}`}
            style={{
              position: "absolute",
              left: screenX,
              top: screenY,
              width: UNIT_SIZE,
              height: UNIT_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            🏠
          </div>,
        );
      } else if (objType === 3) {
        // Rock
        tiles.push(
          <div
            key={`rock-${x}-${y}`}
            style={{
              position: "absolute",
              left: screenX,
              top: screenY,
              width: UNIT_SIZE,
              height: UNIT_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            🪨
          </div>,
        );
      }
    }
  }

  // Render interactive items (chests, NPCs)
  for (let y = renderStartY; y < renderEndY; y++) {
    for (let x = renderStartX; x < renderEndX; x++) {
      const intType = WORLD_DATA.interactive[y][x];
      if (intType === 0) continue;

      const screenX = (x - cameraPos.x) * UNIT_SIZE;
      const screenY = (y - cameraPos.y) * UNIT_SIZE;

      if (intType === 1) {
        // Chest
        tiles.push(
          <div
            key={`chest-${x}-${y}`}
            style={{
              position: "absolute",
              left: screenX,
              top: screenY,
              width: UNIT_SIZE,
              height: UNIT_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            📦
          </div>,
        );
      } else if (intType === 2) {
        // NPC
        tiles.push(
          <div
            key={`npc-${x}-${y}`}
            style={{
              position: "absolute",
              left: screenX,
              top: screenY,
              width: UNIT_SIZE,
              height: UNIT_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            🧙
          </div>,
        );
      }
    }
  }

  // Render player (always on top, smooth animation)
  const playerScreenX = (playerPos.x - cameraPos.x) * UNIT_SIZE;
  const playerScreenY = (playerPos.y - cameraPos.y) * UNIT_SIZE;

  tiles.push(
    <div
      key="player"
      style={{
        position: "absolute",
        left: playerScreenX,
        top: playerScreenY,
        width: UNIT_SIZE,
        height: UNIT_SIZE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        transition: isMoving ? "none" : "left 0.15s, top 0.15s",
        zIndex: 100,
      }}
    >
      🧑
    </div>,
  );

  // ============================================
  // RENDER - JSX
  // ============================================
  return (
    <div style={{ padding: "20px", fontFamily: "var(--font-sans)" }}>
      <h2 style={{ marginTop: 0, marginBottom: "8px" }}>🎮 Adventure Game (CSS)</h2>
      <p style={{ margin: "0 0 16px", color: "#666", fontSize: "14px" }}>Use arrow keys or WASD to move. Explore the world!</p>

      {/* The game viewport */}
      <div
        style={{
          position: "relative",
          width: CAMERA_WIDTH * UNIT_SIZE,
          height: CAMERA_HEIGHT * UNIT_SIZE,
          backgroundColor: "#1a3a2a",
          border: "2px solid #333",
          borderRadius: "4px",
          overflow: "hidden",
          marginBottom: "16px",
        }}
      >
        {tiles}
      </div>

      {/* Status display */}
      <div
        style={{
          padding: "12px",
          backgroundColor: "#fff",
          borderRadius: "4px",
          borderLeft: "4px solid #4a7c59",
          marginBottom: "16px",
        }}
      >
        <p style={{ margin: "0 0 4px", color: "#333", fontSize: "14px" }}>
          <strong>Position:</strong> ({playerPos.x}, {playerPos.y}) |<strong style={{ marginLeft: "12px" }}>World:</strong> 40×24 tiles
        </p>
        <p style={{ margin: "4px 0 0", color: "#555", fontSize: "13px", minHeight: "20px" }}>{message}</p>
      </div>

      {/* Info */}
      <div
        style={{
          fontSize: "13px",
          color: "#555",
          backgroundColor: "#fff",
          padding: "12px",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ marginTop: 0, marginBottom: "8px" }}>ℹ️ How This Works:</h4>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>
            <strong>World data:</strong> Three 2D arrays (floor, objects, interactive)
          </li>
          <li>
            <strong>Collision:</strong> Before moving, check if the target cell is empty
          </li>
          <li>
            <strong>Camera:</strong> Follows player, centers them on screen
          </li>
          <li>
            <strong>Rendering:</strong> Only visible tiles are rendered as divs
          </li>
          <li>
            <strong>Animation:</strong> CSS transition on player movement
          </li>
        </ul>
      </div>
    </div>
  );
}
