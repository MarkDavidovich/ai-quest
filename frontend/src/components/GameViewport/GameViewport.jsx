import React, { useMemo } from "react";
import style from "./GameViewport.module.css";
import Tile from "../Tile/Tile";
import Player from "../Player/Player";
import { UNIT_SIZE, CAMERA_WIDTH, CAMERA_HEIGHT } from "../../utils/constants";

const GameViewport = ({ playerDisplayPos, cameraPos, facingDir, currentMapData, isMoving }) => {
  // Center maps smaller than the camera
  const centerOffsets = useMemo(
    () => ({
      x: Math.max(0, (CAMERA_WIDTH - currentMapData.width) / 2),
      y: Math.max(0, (CAMERA_HEIGHT - currentMapData.height) / 2),
    }),
    [currentMapData.width, currentMapData.height],
  );

  // Memoize visible tile calculation - only recalc if cameraPos changes
  const visibleTiles = useMemo(() => {
    const tiles = [];
    const { width, height, floor, objects, interactive } = currentMapData;

    const renderStartX = Math.max(0, Math.floor(cameraPos.x));
    const renderEndX = Math.min(width, Math.ceil(cameraPos.x + CAMERA_WIDTH));
    const renderStartY = Math.max(0, Math.floor(cameraPos.y));
    const renderEndY = Math.min(height, Math.ceil(cameraPos.y + CAMERA_HEIGHT));

    // Floor tiles
    for (let y = renderStartY; y < renderEndY; y++) {
      for (let x = renderStartX; x < renderEndX; x++) {
        tiles.push(<Tile key={`floor-${x}-${y}`} type={floor[y][x]} x={x} y={y} cameraPos={cameraPos} centerOffsets={centerOffsets} category="floor" />);
      }
    }

    // Objects
    for (let y = renderStartY; y < renderEndY; y++) {
      for (let x = renderStartX; x < renderEndX; x++) {
        const objType = objects[y][x];
        if (objType !== 0) {
          tiles.push(<Tile key={`obj-${x}-${y}`} type={objType} x={x} y={y} cameraPos={cameraPos} centerOffsets={centerOffsets} category="object" />);
        }
      }
    }

    // Interactive
    for (let y = renderStartY; y < renderEndY; y++) {
      for (let x = renderStartX; x < renderEndX; x++) {
        const intType = interactive[y][x];
        if (intType !== 0) {
          tiles.push(<Tile key={`int-${x}-${y}`} type={intType} x={x} y={y} cameraPos={cameraPos} centerOffsets={centerOffsets} category="interactive" />);
        }
      }
    }

    return tiles;
  }, [cameraPos.x, cameraPos.y, currentMapData, centerOffsets]); // Only recalc when camera grid position or map data changes

  return (
    <div
      className={style.viewport}
      style={{
        "--viewport-width": `${CAMERA_WIDTH * UNIT_SIZE}px`,
        "--viewport-height": `${CAMERA_HEIGHT * UNIT_SIZE}px`,
      }}
    >
      {visibleTiles}
      <Player x={playerDisplayPos.x} y={playerDisplayPos.y} cameraPos={cameraPos} centerOffsets={centerOffsets} facingDir={facingDir} isMoving={isMoving} />
    </div>
  );
};

export default GameViewport;
