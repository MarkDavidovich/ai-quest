export const createChiefHouseMap = () => ({
  width: 10,
  height: 8,
  floor: Array(8)
    .fill(null)
    .map((_, row) =>
      Array(10)
        .fill(null)
        .map((_, col) => {
          const innerTop = 1;
          const innerBottom = 6;
          const innerLeft = 1;
          const innerRight = 8;
          const isTop = row === innerTop;
          const isBottom = row === innerBottom;
          const isLeft = col === innerLeft;
          const isRight = col === innerRight;
          const isInside = row >= innerTop && row <= innerBottom && col >= innerLeft && col <= innerRight;
          const isDoorThreshold = row === 7 && col === 5;

          if (isDoorThreshold) return "houseEntrance";
          if (!isInside) return "stone";

          if (isTop && isLeft) return "houseFloorTL";
          if (isTop && isRight) return "houseFloorTR";
          if (isBottom && isLeft) return "houseFloorBL";
          if (isBottom && isRight) return "houseFloorBR";
          if (isTop) return "houseFloorT";
          if (isBottom) return "houseFloorB";
          if (isLeft) return "houseFloorL";
          if (isRight) return "houseFloorR";
          return "houseFloorC";
        }),
    ),
  objects: Array(8)
    .fill(null)
    .map((_, row) =>
      Array(10)
        .fill(null)
        .map((_, col) => {
          const isTop = row === 0;
          const isBottom = row === 7;
          const isLeft = col === 0;
          const isRight = col === 9;
          const isExit = isBottom && col === 5;
          const isTopNearLeft = isTop && col === 1;
          const isTopNearRight = isTop && col === 8;
          const isBottomExitLeft = isBottom && col === 4;
          const isBottomExitRight = isBottom && col === 6;

          if (isExit) return 0;
          if (isTop && isLeft) return "houseWallTL";
          if (isTopNearLeft || isTopNearRight) return "houseWallTRight";
          if (isTop && isRight) return "houseWallTR";
          if (isLeft && !isTop && !isBottom) return "houseWallLTop";
          if (isRight && !isTop && !isBottom) return "houseWallRTop";
          if (isBottom && isLeft) return "houseWallBL";
          if (isBottomExitLeft) return "houseWallBLeft";
          if (isBottomExitRight) return "houseWallB";
          if (isBottom && isRight) return "houseWallBR";
          if (isTop) return "houseWallTRight";
          if (isBottom) return "houseWallBRight";

          if (row === 1 && col === 1) return "housePotion";
          if (row === 1 && col === 7) return "houseClayPot";
          if (row === 2 && col === 2) return "houseBox";
          if (row === 2 && col === 6) return "houseTable";
          if (row === 3 && col === 6) return "houseChair";
          if (row === 4 && col === 2) return "houseBucket";
          if (row === 4 && col === 6) return "villageLeaderNpc";
          if (row === 5 && col === 7) return "houseBox";
          if (row === 6 && col === 1) return "houseClayPot";

          return 0;
        }),
    ),
  interactive: Array(8)
    .fill(null)
    .map((_, row) =>
      Array(10)
        .fill(null)
        .map((_, col) => {
          if (row === 7 && col === 5) return 4;
          return 0;
        }),
    ),
});
