export const createForestLevel = ({ GRID_WIDTH, GRID_HEIGHT, toWorldKey }) => {
  const FOREST_HOUSES = [
    { x: 4, y: 5, type: "house" },
    { x: 34, y: 5, type: "house" },
    { x: 21, y: 12, type: "house2" },
    { x: 10, y: 15, type: "house" },
  ];

  const FOREST_NPCS = [
    { x: 10, y: 9, type: "oldManNpc2" },
    { x: 25, y: 7, type: "oldManNpc" },
    { x: 20, y: 15, type: "npc" },
    { x: 10, y: 21, type: "npc" },
    { x: 25, y: 3, type: "npc" },
    { x: 8, y: 17, type: "npc" },
  ];

  const FOREST_PATH_RECTS = [
    { left: 4, right: 4, top: 6, bottom: 7 },
    { left: 5, right: 6, top: 7, bottom: 7 },
    { left: 8, right: 12, top: 7, bottom: 7 },
    { left: 14, right: 18, top: 7, bottom: 7 },
    { left: 20, right: 23, top: 7, bottom: 7 },
    { left: 25, right: 29, top: 7, bottom: 7 },
    { left: 34, right: 34, top: 6, bottom: 7 },
    { left: 31, right: 34, top: 7, bottom: 7 },
    { left: 18, right: 18, top: 8, bottom: 11 },
    { left: 21, right: 21, top: 13, bottom: 15 },
    { left: 21, right: 21, top: 12, bottom: 12 },
    { left: 10, right: 13, top: 15, bottom: 15 },
    { left: 15, right: 18, top: 15, bottom: 15 },
    { left: 20, right: 21, top: 15, bottom: 15 },
    { left: 10, right: 10, top: 16, bottom: 17 },
  ];

  const FOREST_FIELD_RECTS = [{ left: 35, right: 39, top: 12, bottom: 13 }];

  const FOREST_FIELD_OVERRIDES = new Map(
    [
      [39, 12, "dirtFieldT"],
      [39, 13, "dirtFieldB"],
    ].map(([x, y, type]) => [`${x},${y}`, type]),
  );

  const FOREST_FLOWERS = new Map(
    [
      [1, 1, "gFlower1"],
      [2, 1, "gFlower2"],
      [4, 1, "gFlower1"],
      [6, 1, "gFlower2"],
      [8, 1, "gFlower3"],
      [9, 1, "gFlower1"],
      [13, 1, "gFlower2"],
      [14, 1, "gFlower1"],
      [17, 1, "gFlower3"],
      [18, 1, "gFlower2"],
      [21, 1, "gFlower1"],
      [22, 1, "gFlower3"],
      [25, 1, "gFlower2"],
      [26, 1, "gFlower1"],
      [29, 1, "gFlower3"],
      [30, 1, "gFlower2"],
      [34, 1, "gFlower3"],
      [35, 1, "gFlower1"],
      [3, 2, "gFlower3"],
      [1, 2, "gFlower1"],
      [1, 5, "gFlower2"],
      [2, 6, "gFlower1"],
      [1, 8, "gFlower2"],
      [36, 1, "gFlower1"],
      [37, 1, "gFlower2"],
      [34, 2, "gFlower3"],
      [38, 2, "gFlower2"],
      [37, 5, "gFlower1"],
      [38, 5, "gFlower2"],
      [2, 8, "gFlower3"],
      [1, 10, "gFlower1"],
      [2, 13, "gFlower1"],
      [2, 14, "gFlower3"],
      [36, 8, "gFlower1"],
      [37, 8, "gFlower2"],
      [38, 10, "gFlower3"],
      [2, 12, "gFlower2"],
      [37, 12, "gFlower3"],
      [36, 14, "gFlower2"],
      [35, 14, "gFlower1"],
      [4, 17, "gFlower1"],
      [3, 18, "gFlower2"],
      [2, 18, "gFlower3"],
      [2, 20, "gFlower3"],
      [1, 20, "gFlower1"],
      [33, 17, "gFlower2"],
      [35, 18, "gFlower3"],
      [36, 18, "gFlower1"],
      [37, 20, "gFlower2"],
      [7, 21, "gFlower2"],
      [2, 21, "gFlower3"],
      [11, 21, "gFlower1"],
      [17, 21, "gFlower2"],
      [23, 21, "gFlower3"],
      [29, 21, "gFlower1"],
      [34, 21, "gFlower2"],
      [3, 22, "gFlower1"],
      [5, 22, "gFlower2"],
      [12, 22, "gFlower3"],
      [16, 22, "gFlower2"],
      [18, 22, "gFlower1"],
      [24, 22, "gFlower3"],
      [26, 22, "gFlower2"],
      [31, 21, "gFlower1"],
      [28, 22, "gFlower1"],
      [36, 22, "gFlower2"],
      [34, 22, "gFlower3"],
    ].map(([x, y, type]) => [`${x},${y}`, type]),
  );

  const FOREST_BUSHES = new Map(
    [
      [1, 3, "gBush1"],
      [2, 4, "gBush2"],
      [2, 5, "gBush1"],
      [10, 1, "gBush1"],
      [11, 1, "gBush2"],
      [16, 1, "gBush2"],
      [17, 1, "gBush1"],
      [24, 1, "gBush1"],
      [25, 1, "gBush2"],
      [32, 1, "gBush2"],
      [33, 1, "gBush1"],
      [1, 7, "gBush1"],
      [2, 7, "gBush2"],
      [2, 10, "gBush1"],
      [1, 11, "gBush2"],
      [2, 11, "gBush1"],
      [1, 15, "gBush2"],
      [2, 16, "gBush1"],
      [1, 17, "gBush2"],
      [1, 21, "gBush2"],
      [3, 21, "gBush1"],
      [5, 21, "gBush2"],
      [9, 21, "gBush1"],
      [13, 21, "gBush2"],
      [15, 21, "gBush1"],
      [19, 21, "gBush2"],
      [21, 21, "gBush1"],
      [25, 21, "gBush2"],
      [27, 21, "gBush1"],
      [32, 21, "gBush2"],
      [36, 20, "gBush1"],
      [1, 22, "gBush1"],
      [6, 22, "gBush2"],
      [14, 22, "gBush1"],
      [22, 22, "gBush2"],
      [30, 22, "gBush1"],
      [37, 2, "gBush1"],
      [36, 3, "gBush2"],
      [37, 4, "gBush1"],
      [36, 5, "gBush2"],
      [38, 6, "gBush2"],
      [37, 7, "gBush1"],
      [37, 9, "gBush2"],
      [36, 10, "gBush1"],
      [37, 11, "gBush2"],
      [38, 13, "gBush1"],
      [37, 14, "gBush2"],
      [37, 16, "gBush2"],
      [38, 17, "gBush1"],
      [37, 18, "gBush2"],
      [36, 21, "gBush2"],
      [38, 21, "gBush1"],
      [38, 22, "gBush2"],
      [19, 17, "gBush1"],
      [22, 18, "gBush2"],
    ].map(([x, y, type]) => [`${x},${y}`, type]),
  );

  const FOREST_STUMPS = new Map(
    [
      [2, 3, "gStump2"],
      [3, 4, "gStump1"],
      [7, 3, "gStump1"],
      [12, 1, "gStump1"],
      [15, 1, "gStump2"],
      [20, 1, "gStump2"],
      [23, 1, "gStump1"],
      [28, 1, "gStump1"],
      [31, 1, "gStump2"],
      [2, 9, "gStump1"],
      [11, 8, "gStump1"],
      [12, 9, "gStump2"],
      [11, 10, "gStump1"],
      [2, 15, "gStump2"],
      [1, 18, "gStump1"],
      [9, 22, "gStump2"],
      [31, 4, "gStump2"],
      [37, 3, "gStump1"],
      [36, 6, "gStump1"],
      [37, 10, "gStump2"],
      [5, 18, "gStump2"],
      [28, 17, "gStump1"],
      [37, 22, "gStump1"],
      [33, 22, "gStump2"],
    ].map(([x, y, type]) => [`${x},${y}`, type]),
  );

  const FOREST_TREE_ANCHORS = [
    [0, 1], [0, 5], [0, 9], [0, 13], [0, 17], [0, 22], [0, 27], [0, 32], [0, 36],
    [22, 2], [22, 6], [22, 10], [22, 15], [22, 20], [22, 25], [22, 30], [22, 35],
    [2, 0], [5, 0], [7, 0], [11, 0], [15, 0], [19, 0], [24, 0], [29, 0], [34, 0], [37, 0], [3, 37], [9, 37],
    [4, 38], [8, 38], [12, 38], [16, 38], [20, 38],
    [21, 0], [21, 4], [21, 8], [21, 12], [21, 16], [21, 20], [21, 24], [21, 28], [21, 32], [21, 36],
    [6, 35], [14, 2], [14, 35],
    [2, 8], [3, 30], [8, 3], [8, 35], [16, 4], [17, 32],
    [17, 13], [18, 27], [11, 30], [13, 5], [12, 16], [10, 24],
  ];

  const FOREST_FLAGS = new Map(
    [
      [19, 13, "flag"],
      [24, 13, "flag"],
      [35, 11, "flag"],
    ].map(([x, y, type]) => [`${x},${y}`, type]),
  );

  const FOREST_WATER_REGIONS = [
    { top: 1, bottom: 3, left: 10, right: 12 },
    { top: 17, bottom: 19, left: 29, right: 31 },
  ];

  const FOREST_FIELD_TILES = new Set();
  const FOREST_PATH_TILES = new Set();
  const FOREST_PATH_OVERRIDES = new Map(
    [
      [4, 7, "dirtPathCornerBL"],
      [18, 7, "dirtPathCornerTR"],
      [18, 11, "dirtPathVerticalBottom"],
    ].map(([x, y, type]) => [`${x},${y}`, type]),
  );

  for (const rect of FOREST_FIELD_RECTS) {
    for (let y = rect.top; y <= rect.bottom; y += 1) {
      for (let x = rect.left; x <= rect.right; x += 1) {
        FOREST_FIELD_TILES.add(toWorldKey(x, y));
      }
    }
  }

  for (const rect of FOREST_PATH_RECTS) {
    for (let y = rect.top; y <= rect.bottom; y += 1) {
      for (let x = rect.left; x <= rect.right; x += 1) {
        FOREST_PATH_TILES.add(toWorldKey(x, y));
      }
    }
  }

  const getForestFieldTile = (x, y) => {
    const overrideTile = FOREST_FIELD_OVERRIDES.get(toWorldKey(x, y));
    if (overrideTile) return overrideTile;

    const hasNorth = FOREST_FIELD_TILES.has(toWorldKey(x, y - 1));
    const hasSouth = FOREST_FIELD_TILES.has(toWorldKey(x, y + 1));
    const hasWest = FOREST_FIELD_TILES.has(toWorldKey(x - 1, y));
    const hasEast = FOREST_FIELD_TILES.has(toWorldKey(x + 1, y));

    if (!hasNorth && !hasWest) return "dirtFieldTL";
    if (!hasNorth && !hasEast) return "dirtFieldTR";
    if (!hasSouth && !hasWest) return "dirtFieldBL";
    if (!hasSouth && !hasEast) return "dirtFieldBR";
    if (!hasNorth) return "dirtFieldT";
    if (!hasSouth) return "dirtFieldB";
    if (!hasWest) return "dirtFieldL";
    if (!hasEast) return "dirtFieldR";
    return "dirtFieldC";
  };

  const getForestPathTile = (x, y) => {
    const hasNorth = FOREST_PATH_TILES.has(toWorldKey(x, y - 1));
    const hasSouth = FOREST_PATH_TILES.has(toWorldKey(x, y + 1));
    const hasWest = FOREST_PATH_TILES.has(toWorldKey(x - 1, y));
    const hasEast = FOREST_PATH_TILES.has(toWorldKey(x + 1, y));

    if (hasNorth && hasSouth && !hasWest && !hasEast) return "dirtPathVerticalMiddle";
    if (hasNorth && !hasSouth && !hasWest && !hasEast) return "dirtPathVerticalBottom";
    if (!hasNorth && hasSouth && !hasWest && !hasEast) return "dirtPathVerticalTop";
    if (!hasNorth && hasSouth && !hasWest && hasEast) return "dirtPathCornerTL";
    if (!hasNorth && hasSouth && hasWest && !hasEast) return "dirtPathCornerTR";
    if (hasNorth && !hasSouth && !hasWest && hasEast) return "dirtPathCornerBL";
    if (hasNorth && !hasSouth && hasWest && !hasEast) return "dirtPathCornerBR";
    if (!hasNorth && !hasSouth && hasWest && hasEast) return "dirtPathHorizontalMiddle";
    if (!hasNorth && !hasSouth && !hasWest && hasEast) return "dirtPathHorizontalLeft";
    if (!hasNorth && !hasSouth && hasWest && !hasEast) return "dirtPathHorizontalRight";
    if (hasWest && hasEast) return "dirtPathHorizontalMiddle";
    if (hasNorth && hasSouth) return "dirtPathVerticalMiddle";
    if (hasEast || hasWest) return hasWest ? "dirtPathHorizontalRight" : "dirtPathHorizontalLeft";
    if (hasNorth || hasSouth) return hasNorth ? "dirtPathVerticalBottom" : "dirtPathVerticalTop";

    return "dirtPatchSmall";
  };

  const getForestWaterTile = (x, y) => {
    for (const region of FOREST_WATER_REGIONS) {
      const { top, bottom, left, right } = region;
      const isInsideWater = y >= top && y <= bottom && x >= left && x <= right;

      if (!isInsideWater) {
        continue;
      }

      const isTop = y === top;
      const isBottom = y === bottom;
      const isLeft = x === left;
      const isRight = x === right;

      if (isTop && isLeft) return "gWaterTL";
      if (isTop && isRight) return "gWaterTR";
      if (isBottom && isLeft) return "gWaterBL";
      if (isBottom && isRight) return "gWaterBR";
      if (isTop) return "gWaterT";
      if (isBottom) return "gWaterB";
      if (isLeft) return "gWaterL";
      if (isRight) return "gWaterR";
      return "gWaterC";
    }

    return null;
  };

  const worldData = {
    floor: Array(GRID_HEIGHT)
      .fill(null)
      .map((_, row) =>
        Array(GRID_WIDTH)
          .fill(null)
          .map((_, col) => {
            const waterTile = getForestWaterTile(col, row);
            if (waterTile) return waterTile;

            if (FOREST_FIELD_TILES.has(toWorldKey(col, row))) {
              return getForestFieldTile(col, row);
            }

            const pathOverride = FOREST_PATH_OVERRIDES.get(toWorldKey(col, row));
            if (pathOverride) return pathOverride;

            if (FOREST_PATH_TILES.has(toWorldKey(col, row))) {
              return getForestPathTile(col, row);
            }

            const rand = Math.random();
            if (rand < 0.7) return "gGrass1";
            return `gGrass${Math.floor(Math.random() * 4) + 2}`;
          }),
      ),

    objects: Array(GRID_HEIGHT)
      .fill(null)
      .map((_, row) =>
        Array(GRID_WIDTH)
          .fill(null)
          .map((_, col) => {
            if (FOREST_FIELD_TILES.has(toWorldKey(col, row))) {
              return 0;
            }

            for (const region of FOREST_WATER_REGIONS) {
              const { top, bottom, left, right } = region;
              if (row >= top && row <= bottom && col >= left && col <= right) {
                return 0;
              }
            }

            for (const { x, y, type } of FOREST_HOUSES) {
              const houseTop = y - 2;
              const houseBottom = y;
              const houseLeft = x - 1;
              const houseRight = x + 2;

              if (row >= houseTop && row <= houseBottom && col >= houseLeft && col <= houseRight) {
                if (row === y && col === x) return type;
                return "houseBlock";
              }
            }

            for (const [r, c] of FOREST_TREE_ANCHORS) {
              if (row === r && col === c) return "tree";
              if (row === r && col === c + 1) return "treeBlock";
              if (row === r + 1 && col === c) return "treeBlock";
              if (row === r + 1 && col === c + 1) return "treeBlock";
            }

            const flagTile = FOREST_FLAGS.get(toWorldKey(col, row));
            if (flagTile) return flagTile;

            const bushTile = FOREST_BUSHES.get(toWorldKey(col, row));
            if (bushTile) return bushTile;

            const flowerTile = FOREST_FLOWERS.get(toWorldKey(col, row));
            if (flowerTile) return flowerTile;

            const stumpTile = FOREST_STUMPS.get(toWorldKey(col, row));
            if (stumpTile) return stumpTile;

            const forestNpc = FOREST_NPCS.find((npc) => npc.x === col && npc.y === row);
            if (forestNpc) return forestNpc.type;
            return 0;
          }),
      ),

    interactive: Array(GRID_HEIGHT)
      .fill(null)
      .map(() =>
        Array(GRID_WIDTH)
          .fill(null)
          .map(() => 0),
      ),
  };

  const teleports = {
    "4,5": { targetMap: "gHouse1", targetX: 5, targetY: 6, returnMap: "forest", returnX: 4, returnY: 6 },
    "34,5": { targetMap: "gHouse2", targetX: 5, targetY: 6, returnMap: "forest", returnX: 34, returnY: 6 },
    "21,12": { targetMap: "chiefHouse", targetX: 5, targetY: 6, returnMap: "forest", returnX: 21, returnY: 13 },
    "10,15": { targetMap: "playerHouse", targetX: 5, targetY: 6, returnMap: "forest", returnX: 10, returnY: 16 },
    "39,12": { targetMap: "deepForest", targetX: 1, targetY: 12, returnMap: "forest", returnX: 39, returnY: 12 },
    "39,13": { targetMap: "deepForest", targetX: 1, targetY: 13, returnMap: "forest", returnX: 39, returnY: 13 },
  };

  const map = {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    floor: worldData.floor,
    objects: worldData.objects,
    interactive: worldData.interactive.map((row, rIdx) =>
      row.map((tile, cIdx) => {
        if (
          (rIdx === 5 && cIdx === 4) ||
          (rIdx === 5 && cIdx === 34) ||
          (rIdx === 12 && cIdx === 21) ||
          (rIdx === 15 && cIdx === 10) ||
          (rIdx === 12 && cIdx === 39) ||
          (rIdx === 13 && cIdx === 39)
        ) {
          return 4;
        }
        return tile;
      }),
    ),
  };

  return { worldData, teleports, map };
};
