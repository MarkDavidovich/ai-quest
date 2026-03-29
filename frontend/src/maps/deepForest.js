export const createDeepForestLevel = ({ GRID_WIDTH, GRID_HEIGHT, toWorldKey }) => {
  const DEEP_FOREST_FIELD_RECTS = [{ left: 0, right: 4, top: 12, bottom: 13 }];
  const DEEP_FOREST_FIELD_OVERRIDES = new Map(
    [[0, 12, "dirtFieldT"], [0, 13, "dirtFieldB"]].map(([x, y, type]) => [`${x},${y}`, type]),
  );

  const DEEP_FOREST_PATH_RECTS = [
    { left: 4, right: 4, top: 9, bottom: 12 },
    { left: 4, right: 9, top: 9, bottom: 9 },
    { left: 9, right: 9, top: 6, bottom: 9 },
    { left: 9, right: 14, top: 6, bottom: 6 },
    { left: 14, right: 14, top: 6, bottom: 10 },
    { left: 14, right: 19, top: 10, bottom: 10 },
    { left: 19, right: 19, top: 8, bottom: 16 },
    { left: 19, right: 25, top: 8, bottom: 8 },
    { left: 19, right: 24, top: 16, bottom: 16 },
    { left: 24, right: 24, top: 16, bottom: 21 },
    { left: 24, right: 31, top: 21, bottom: 21 },
    { left: 31, right: 31, top: 14, bottom: 21 },
    { left: 31, right: 36, top: 14, bottom: 14 },
    { left: 36, right: 36, top: 13, bottom: 14 },
    { left: 22, right: 35, top: 5, bottom: 5 },
    { left: 22, right: 22, top: 5, bottom: 8 },
    { left: 30, right: 30, top: 5, bottom: 14 },
    { left: 7, right: 7, top: 14, bottom: 20 },
    { left: 7, right: 13, top: 20, bottom: 20 },
    { left: 13, right: 13, top: 18, bottom: 20 },
    { left: 13, right: 18, top: 18, bottom: 18 },
  ];

  const DEEP_FOREST_FIELD_TILES = new Set();
  for (const rect of DEEP_FOREST_FIELD_RECTS) {
    for (let y = rect.top; y <= rect.bottom; y += 1) {
      for (let x = rect.left; x <= rect.right; x += 1) {
        DEEP_FOREST_FIELD_TILES.add(toWorldKey(x, y));
      }
    }
  }

  const DEEP_FOREST_PATH_REMOVALS = new Set([
    toWorldKey(4, 11),
    toWorldKey(17, 10),
    toWorldKey(22, 7),
    toWorldKey(30, 6),
    toWorldKey(8, 20),
    toWorldKey(19, 9),
    toWorldKey(30, 14),
  ]);

  const DEEP_FOREST_PATH_TILES = new Set();
  DEEP_FOREST_PATH_TILES.add(toWorldKey(6, 14)); // Manual addition

  for (const rect of DEEP_FOREST_PATH_RECTS) {
    for (let y = rect.top; y <= rect.bottom; y += 1) {
      for (let x = rect.left; x <= rect.right; x += 1) {
        const worldKey = toWorldKey(x, y);
        if (DEEP_FOREST_PATH_REMOVALS.has(worldKey)) continue;

        DEEP_FOREST_PATH_TILES.add(worldKey);
      }
    }
  }

  const DEEP_FOREST_PATH_OVERRIDES = new Map(
    [
      [4, 9, "dirtPathCornerTL"],
      [4, 12, "dirtPathCornerBL"],
      [4, 10, "dirtPathVerticalBottom"],
      [6, 14, "dirtPathHorizontalLeft"],
      [7, 14, "dirtPathCornerTR"],
      [9, 6, "dirtPathCornerTL"],
      [14, 6, "dirtPathCornerTR"],
      [14, 10, "dirtPathCornerBL"],
      [18, 10, "dirtPathHorizontalLeft"],
      [19, 10, "dirtPathCornerTR"],
      [19, 8, "dirtPathHorizontalLeft"],
      [19, 16, "dirtPathCornerBL"],
      [22, 8, "dirtPathHorizontalMiddle"],
      [22, 6, "dirtPathVerticalBottom"],
      [22, 5, "dirtPathCornerTL"],
      [24, 16, "dirtPathCornerTR"],
      [24, 21, "dirtPathCornerBL"],
      [31, 21, "dirtPathCornerBR"],
      [31, 14, "dirtPathCornerTL"],
      [36, 14, "dirtPathCornerBR"],
      [36, 13, "dirtPathVerticalTop"],
      [30, 5, "dirtPathHorizontalMiddle"],
      [30, 13, "dirtPathVerticalBottom"],
      [35, 5, "dirtPathHorizontalRight"],
      [7, 20, "dirtPathVerticalBottom"],
      [13, 20, "dirtPathCornerBR"],
      [9, 20, "dirtPathHorizontalLeft"],
      [13, 18, "dirtPathCornerTL"],
      [30, 7, "dirtPathVerticalTop"],
      [18, 18, "dirtPathHorizontalRight"],
    ].map(([x, y, type]) => [`${x},${y}`, type]),
  );

  const DEEP_FOREST_WATER_REGIONS = [{ top: 18, bottom: 23, left: 0, right: 5 }];

  const DEEP_FOREST_TREE_ANCHORS = [
    [0, 1], [0, 4], [0, 7], [0, 11], [0, 14], [0, 18], [0, 22], [0, 26], [0, 29], [0, 32], [0, 35], [0, 38],
    [2, 0], [2, 6], [2, 12], [2, 18], [2, 24], [2, 31], [2, 36],
    [4, 2], [4, 8], [4, 15], [4, 26], [4, 34],
    [6, 1], [6, 11], [6, 20], [6, 28], [6, 36],
    [8, 6], [8, 15], [8, 23], [8, 34],
    [10, 2], [10, 9], [10, 17], [10, 26], [10, 37],
    [12, 12], [12, 22], [12, 34],
    [14, 2], [14, 10], [14, 17], [14, 26], [14, 35],
    [16, 5], [16, 14], [16, 22], [16, 33],
    [18, 8], [18, 17], [18, 27], [18, 35],
    [20, 10], [20, 19], [20, 28], [20, 34],
    [22, 6], [22, 9], [22, 12], [22, 15], [22, 18], [22, 24], [22, 28], [22, 32], [22, 36],
  ];

  const DEEP_FOREST_HOUSES = [
    { x: 37, y: 3, type: "abandonedHouse1" },
    { x: 36, y: 22, type: "abandonedHouse2" },
  ];

  const DEEP_FOREST_CARTS = [[37, 21]];

  const DEEP_FOREST_BUSHES = new Map(
    [
      [0, 8, "gBush1"], [0, 16, "gBush2"], [0, 21, "gBush1"], [1, 23, "gBush2"], [6, 23, "gBush1"],
      [1, 6, "gBush1"], [2, 7, "gBush2"], [3, 11, "gBush1"], [5, 4, "gBush2"],
      [7, 3, "gBush1"], [11, 7, "gBush2"], [12, 8, "gBush1"], [13, 2, "gBush2"],
      [16, 9, "gBush1"], [17, 6, "gBush2"], [21, 2, "gBush1"], [22, 1, "gBush2"],
      [25, 9, "gBush1"], [26, 6, "gBush2"], [28, 3, "gBush1"], [29, 8, "gBush2"],
      [38, 6, "gBush1"], [38, 10, "gBush2"], [37, 16, "gBush1"], [35, 18, "gBush2"],
      [31, 18, "gBush1"], [28, 19, "gBush2"], [20, 20, "gBush1"], [17, 20, "gBush2"],
      [10, 18, "gBush1"], [6, 16, "gBush2"], [6, 22, "gBush1"], [13, 22, "gBush2"],
      [18, 22, "gBush1"], [23, 22, "gBush2"], [27, 22, "gBush1"], [32, 22, "gBush2"],
      [8, 23, "gBush1"], [11, 23, "gBush2"], [14, 23, "gBush1"], [17, 23, "gBush2"],
      [20, 23, "gBush1"], [23, 23, "gBush2"], [26, 23, "gBush1"], [29, 23, "gBush2"],
      [33, 23, "gBush1"], [36, 23, "gBush2"], [39, 23, "gBush1"],
    ].map(([x, y, type]) => [`${x},${y}`, type]),
  );

  const DEEP_FOREST_FLOWERS = new Map(
    [
      [3, 1, "gFlower3"], [9, 2, "gFlower1"], [15, 1, "gFlower2"], [24, 2, "gFlower3"],
      [30, 1, "gFlower1"], [34, 3, "gFlower2"], [7, 8, "gFlower2"], [10, 11, "gFlower3"],
      [14, 13, "gFlower1"], [21, 10, "gFlower2"], [27, 10, "gFlower3"], [33, 12, "gFlower1"],
      [3, 15, "gFlower2"], [11, 15, "gFlower1"], [16, 16, "gFlower3"], [26, 17, "gFlower2"],
      [29, 16, "gFlower1"], [34, 17, "gFlower3"], [9, 22, "gFlower2"], [15, 22, "gFlower1"],
      [2, 23, "gFlower2"], [5, 23, "gFlower3"], [19, 23, "gFlower3"], [30, 23, "gFlower2"], [38, 23, "gFlower1"],
    ].map(([x, y, type]) => [`${x},${y}`, type]),
  );

  const DEEP_FOREST_ROOTS = new Map(
    [
      [0, 23, "dRoots1"], [3, 0, "dRoots1"], [3, 23, "dRoots2"], [6, 0, "dRoots2"], [10, 0, "dRoots1"], [12, 3, "dRoots2"], [18, 4, "dRoots1"], [27, 1, "dRoots2"],
      [8, 1, "dRoots1"], [15, 0, "dRoots2"], [35, 1, "dRoots1"],
      [34, 0, "dRoots1"], [39, 4, "dRoots2"], [6, 5, "dRoots1"], [17, 8, "dRoots2"],
      [24, 10, "dRoots1"], [29, 11, "dRoots2"], [36, 7, "dRoots1"], [5, 17, "dRoots2"],
      [12, 19, "dRoots1"], [16, 21, "dRoots2"], [27, 20, "dRoots2"],
      [38, 18, "dRoots2"], [7, 23, "dRoots1"], [12, 23, "dRoots2"],
      [16, 23, "dRoots1"], [22, 23, "dRoots2"], [28, 23, "dRoots1"], [35, 23, "dRoots2"],
      [39, 20, "dRoots1"], [39, 14, "dRoots2"], [39, 8, "dRoots1"], [39, 2, "dRoots2"],
    ].map(([x, y, type]) => [`${x},${y}`, type]),
  );

  const DEEP_FOREST_STUMPS = new Map(
    [
      [2, 23, "dStump"], [4, 1, "dStump"], [5, 23, "dStump"], [14, 2, "dStump"], [23, 0, "dStump"], [31, 4, "dStump"],
      [8, 10, "dStump"], [15, 12, "dStump"], [28, 9, "dStump"], [35, 15, "dStump"],
      [9, 18, "dStump"], [25, 18, "dStump"], [1, 10, "dStump"], [1, 15, "dStump"],
      [38, 12, "dStump"], [38, 21, "dStump"], [24, 23, "dStump"], [31, 23, "dStump"],
    ].map(([x, y]) => [`${x},${y}`, "dStump"]),
  );

  const isWaterTile = (x, y) =>
    DEEP_FOREST_WATER_REGIONS.some((region) => y >= region.top && y <= region.bottom && x >= region.left && x <= region.right);

  const isPathTile = (x, y) => DEEP_FOREST_PATH_TILES.has(toWorldKey(x, y));
  const isHouseFootprintTile = (x, y) =>
    DEEP_FOREST_HOUSES.some(({ x: houseX, y: houseY, type }) => {
      const width = type === "abandonedHouse2" ? 3 : 4;
      const left = houseX - 1;
      const right = left + width - 1;
      const top = houseY - 2;
      const bottom = houseY;
      return x >= left && x <= right && y >= top && y <= bottom;
    });
  const isCartFootprintTile = (x, y) =>
    DEEP_FOREST_CARTS.some(([cartRow, cartCol]) => x >= cartCol && x <= cartCol + 1 && y >= cartRow - 1 && y <= cartRow);

  const ACTIVE_TREE_ANCHORS = DEEP_FOREST_TREE_ANCHORS.filter(([row, col]) => {
    const footprint = [
      [col, row],
      [col + 1, row],
      [col, row + 1],
      [col + 1, row + 1],
    ];

    return footprint.every(([x, y]) => {
      if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
      if (isPathTile(x, y) || isWaterTile(x, y) || isHouseFootprintTile(x, y) || isCartFootprintTile(x, y)) return false;
      return true;
    });
  });

  const getWaterTile = (x, y) => {
    for (const region of DEEP_FOREST_WATER_REGIONS) {
      const { top, bottom, left, right } = region;
      if (y < top || y > bottom || x < left || x > right) continue;

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

  const getDeepForestFieldTile = (x, y) => {
    const overrideTile = DEEP_FOREST_FIELD_OVERRIDES.get(toWorldKey(x, y));
    if (overrideTile) return overrideTile;

    const hasNorth = DEEP_FOREST_FIELD_TILES.has(toWorldKey(x, y - 1));
    const hasSouth = DEEP_FOREST_FIELD_TILES.has(toWorldKey(x, y + 1));
    const hasWest = DEEP_FOREST_FIELD_TILES.has(toWorldKey(x - 1, y));
    const hasEast = DEEP_FOREST_FIELD_TILES.has(toWorldKey(x + 1, y));

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

  const getPathTile = (x, y) => {
    const override = DEEP_FOREST_PATH_OVERRIDES.get(toWorldKey(x, y));
    if (override) return override;

    const hasNorth = DEEP_FOREST_PATH_TILES.has(toWorldKey(x, y - 1));
    const hasSouth = DEEP_FOREST_PATH_TILES.has(toWorldKey(x, y + 1));
    const hasWest = DEEP_FOREST_PATH_TILES.has(toWorldKey(x - 1, y));
    const hasEast = DEEP_FOREST_PATH_TILES.has(toWorldKey(x + 1, y));

    if (hasNorth && hasSouth && !hasWest && !hasEast) return "dirtPathVerticalMiddle";
    if (hasNorth && !hasSouth && !hasWest && !hasEast) return "dirtPathVerticalBottom";
    if (!hasNorth && hasSouth && !hasWest && !hasEast) return "dirtPathVerticalTop";
    if (!hasNorth && !hasSouth && hasWest && hasEast) return "dirtPathHorizontalMiddle";
    if (!hasNorth && !hasSouth && !hasWest && hasEast) return "dirtPathHorizontalLeft";
    if (!hasNorth && !hasSouth && hasWest && !hasEast) return "dirtPathHorizontalRight";
    if (!hasNorth && hasSouth && !hasWest && hasEast) return "dirtPathCornerTL";
    if (!hasNorth && hasSouth && hasWest && !hasEast) return "dirtPathCornerTR";
    if (hasNorth && !hasSouth && !hasWest && hasEast) return "dirtPathCornerBL";
    if (hasNorth && !hasSouth && hasWest && !hasEast) return "dirtPathCornerBR";
    if (hasWest && hasEast) return "dirtPathHorizontalMiddle";
    if (hasNorth && hasSouth) return "dirtPathVerticalMiddle";
    if (hasWest || hasEast) return hasWest ? "dirtPathHorizontalRight" : "dirtPathHorizontalLeft";
    if (hasNorth || hasSouth) return hasNorth ? "dirtPathVerticalBottom" : "dirtPathVerticalTop";
    return "dirtPathHorizontalMiddle";
  };

  const worldData = {
    floor: Array(GRID_HEIGHT)
      .fill(null)
      .map((_, row) =>
        Array(GRID_WIDTH)
          .fill(null)
          .map((_, col) => {
            const waterTile = getWaterTile(col, row);
            if (waterTile) return waterTile;
            if (DEEP_FOREST_FIELD_TILES.has(toWorldKey(col, row))) return getDeepForestFieldTile(col, row);
            if (DEEP_FOREST_PATH_TILES.has(toWorldKey(col, row))) return getPathTile(col, row);
            return Math.random() < 0.75 ? "gGrass1" : `gGrass${Math.floor(Math.random() * 4) + 2}`;
          }),
      ),

    objects: Array(GRID_HEIGHT)
      .fill(null)
      .map((_, row) =>
        Array(GRID_WIDTH)
          .fill(null)
          .map((_, col) => {
            if (isWaterTile(col, row) || DEEP_FOREST_PATH_TILES.has(toWorldKey(col, row))) {
              return 0;
            }

            for (const { x, y, type } of DEEP_FOREST_HOUSES) {
              const width = type === "abandonedHouse2" ? 3 : 4;
              const left = x - 1;
              const right = left + width - 1;
              const top = y - 2;
              const bottom = y;
              if (row >= top && row <= bottom && col >= left && col <= right) {
                if (row === y && col === x) return type;
                return "houseBlock";
              }
            }

            for (const [r, c] of ACTIVE_TREE_ANCHORS) {
              if (row === r && col === c) return "dTree";
              if (row === r && col === c + 1) return "treeBlock";
              if (row === r + 1 && col === c) return "treeBlock";
              if (row === r + 1 && col === c + 1) return "treeBlock";
            }

            for (const [r, c] of DEEP_FOREST_CARTS) {
              if (row === r && col === c) return "dCart";
              if (row === r && col === c + 1) return "treeBlock";
              if (row === r - 1 && col === c) return "treeBlock";
              if (row === r - 1 && col === c + 1) return "treeBlock";
            }

            const bushTile = DEEP_FOREST_BUSHES.get(toWorldKey(col, row));
            if (bushTile) return bushTile;

            const flowerTile = DEEP_FOREST_FLOWERS.get(toWorldKey(col, row));
            if (flowerTile) return flowerTile;

            const rootTile = DEEP_FOREST_ROOTS.get(toWorldKey(col, row));
            if (rootTile) return rootTile;

            const stumpTile = DEEP_FOREST_STUMPS.get(toWorldKey(col, row));
            if (stumpTile) return stumpTile;

            return 0;
          }),
      ),

    interactive: Array(GRID_HEIGHT)
      .fill(null)
      .map((_, row) =>
        Array(GRID_WIDTH)
          .fill(null)
          .map((_, col) => ((col === 0 && (row === 12 || row === 13)) ? 4 : 0)),
      ),
  };

  const teleports = {
    "0,12": { targetMap: "forest", targetX: 38, targetY: 12, returnMap: "deepForest", returnX: 1, returnY: 12 },
    "0,13": { targetMap: "forest", targetX: 38, targetY: 13, returnMap: "deepForest", returnX: 1, returnY: 13 },
  };

  const map = {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    floor: worldData.floor,
    objects: worldData.objects,
    interactive: worldData.interactive,
  };

  return { worldData, teleports, map };
};
