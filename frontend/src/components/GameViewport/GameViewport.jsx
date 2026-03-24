import React, { memo, useMemo } from "react";
import style from "./GameViewport.module.css";
import Tile from "../Tile/Tile";
import Player from "../Player/Player";
import { UNIT_SIZE, CAMERA_WIDTH, CAMERA_HEIGHT, GRID_WIDTH, GRID_HEIGHT, WORLD_DATA } from "../../utils/constants";

const MemoTile = memo(Tile);

const GameViewport = ({ playerDisplayPos, cameraPos, facingDir }) => {
  // Memoize visible tile calculation - only recalc if cameraPos changes
  const visibleTiles = useMemo(() => {
    const tiles = [];
    const renderStartX = Math.max(0, Math.floor(cameraPos.x));
    const renderEndX = Math.min(GRID_WIDTH, Math.ceil(cameraPos.x + CAMERA_WIDTH));
    const renderStartY = Math.max(0, Math.floor(cameraPos.y));
    const renderEndY = Math.min(GRID_HEIGHT, Math.ceil(cameraPos.y + CAMERA_HEIGHT));

    // Floor tiles
    for (let y = renderStartY; y < renderEndY; y++) {
      for (let x = renderStartX; x < renderEndX; x++) {
        tiles.push(<MemoTile key={`floor-${x}-${y}`} type={WORLD_DATA.floor[y][x]} x={x} y={y} cameraPos={cameraPos} category="floor" />);
      }
    }

    // Objects
    for (let y = renderStartY; y < renderEndY; y++) {
      for (let x = renderStartX; x < renderEndX; x++) {
        const objType = WORLD_DATA.objects[y][x];
        if (objType !== 0) {
          tiles.push(<MemoTile key={`obj-${x}-${y}`} type={objType} x={x} y={y} cameraPos={cameraPos} category="object" />);
        }
      }
    }

    // Interactive
    for (let y = renderStartY; y < renderEndY; y++) {
      for (let x = renderStartX; x < renderEndX; x++) {
        const intType = WORLD_DATA.interactive[y][x];
        if (intType !== 0) {
          tiles.push(<MemoTile key={`int-${x}-${y}`} type={intType} x={x} y={y} cameraPos={cameraPos} category="interactive" />);
        }
      }
    }

    return tiles;
  }, [cameraPos.x, cameraPos.y]); // Only recalc when camera grid position changes

  console.log("GameViewport rendering", { cameraPos, playerDisplayPos });
  return (
    <div
      className={style.viewport}
      style={{
        "--viewport-width": `${CAMERA_WIDTH * UNIT_SIZE}px`,
        "--viewport-height": `${CAMERA_HEIGHT * UNIT_SIZE}px`,
      }}
    >
      {visibleTiles}
      <Player x={playerDisplayPos.x} y={playerDisplayPos.y} cameraPos={cameraPos} facingDir={facingDir} />
    </div>
  );
};

export default GameViewport;
