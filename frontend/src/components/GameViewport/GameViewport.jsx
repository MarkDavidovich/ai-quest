import React from "react";
import styles from "./GameViewport.module.css";
import Tile from "../Tile/Tile";
import Player from "../Player/Player";
import { UNIT_SIZE, CAMERA_WIDTH, CAMERA_HEIGHT, GRID_WIDTH, GRID_HEIGHT, WORLD_DATA } from "../../utils/constants";

const GameViewport = ({ playerPos, cameraPos, isMoving }) => {
  const tiles = [];

  // Render floor tiles (only visible ones)
  const renderStartX = Math.max(0, Math.floor(cameraPos.x));
  const renderEndX = Math.min(GRID_WIDTH, Math.ceil(cameraPos.x + CAMERA_WIDTH));
  const renderStartY = Math.max(0, Math.floor(cameraPos.y));
  const renderEndY = Math.min(GRID_HEIGHT, Math.ceil(cameraPos.y + CAMERA_HEIGHT));

  for (let y = renderStartY; y < renderEndY; y++) {
    for (let x = renderStartX; x < renderEndX; x++) {
      tiles.push(<Tile key={`floor-${x}-${y}`} type={WORLD_DATA.floor[y][x]} x={x} y={y} cameraPos={cameraPos} category="floor" />);
    }
  }

  // Render objects
  for (let y = renderStartY; y < renderEndY; y++) {
    for (let x = renderStartX; x < renderEndX; x++) {
      const objType = WORLD_DATA.objects[y][x];
      if (objType !== 0) {
        tiles.push(<Tile key={`obj-${x}-${y}`} type={objType} x={x} y={y} cameraPos={cameraPos} category="object" />);
      }
    }
  }

  // Render interactive items
  for (let y = renderStartY; y < renderEndY; y++) {
    for (let x = renderStartX; x < renderEndX; x++) {
      const intType = WORLD_DATA.interactive[y][x];
      if (intType !== 0) {
        tiles.push(<Tile key={`int-${x}-${y}`} type={intType} x={x} y={y} cameraPos={cameraPos} category="interactive" />);
      }
    }
  }

  return (
    <div
      className={styles.viewport}
      style={{
        "--viewport-width": `${CAMERA_WIDTH * UNIT_SIZE}px`,
        "--viewport-height": `${CAMERA_HEIGHT * UNIT_SIZE}px`,
      }}
    >
      {tiles}
      <Player x={playerPos.x} y={playerPos.y} cameraPos={cameraPos} isMoving={isMoving} />
    </div>
  );
};

export default GameViewport;
