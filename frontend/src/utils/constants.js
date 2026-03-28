export const UNIT_SIZE = 64;
export const GRID_WIDTH = 40;
export const GRID_HEIGHT = 24;
export const CAMERA_WIDTH = 24;
export const CAMERA_HEIGHT = 12;
export const MOVE_DURATION = 150; // milliseconds for smooth movement animation
export const INVENTORY_SIZE = 12;

export const EMPTY_DIALOGUE = {
  isOpen: false,
  npcId: null,
  nodeId: null,
  text: "",
  choices: [],
};

export const ITEM_DEFINITIONS = {
  potion: {
    id: "potion",
    name: "Potion",
    icon: "🧪",
    kind: "consumable",
    stackable: true,
    maxStack: 99,
  },
  sword: {
    id: "sword",
    name: "Sword",
    icon: "⚔️",
    kind: "equipment",
    stackable: false,
    maxStack: 1,
  },
};

export const INITIAL_INVENTORY = Array.from({ length: INVENTORY_SIZE }, () => null);

export const INITIAL_WORLD_LOOT = {
  "22,4": {
    kind: "chest",
    opened: false,
    drops: [{ itemId: "potion", quantity: 3 }],
  },
  "28,13": {
    kind: "chest",
    opened: false,
    drops: [{ itemId: "sword", quantity: 1 }],
  },
  "16,20": {
    kind: "chest",
    opened: false,
    drops: [{ itemId: "potion", quantity: 2 }],
  },
  "3,3": {
    kind: "chest",
    opened: false,
    drops: [{ itemId: "potion", quantity: 1 }],
  },
};

export const toWorldKey = (x, y) => `${x},${y}`;

const DEFAULT_NPC_CHOICES = [
  { id: "help", label: "What should I do?" },
  { id: "quest", label: "Do you have a quest?" },
  { id: "leave", label: "Goodbye" },
];

export const NPC_NAMES = {
  "10,9": "Sir Aldric",
  "20,15": "Lady Elswyth",
  "25,7": "Cedric",
  "10,21": "Rowena",
  "25,3": "Gareth",
  "8,17": "Maeve",
  tutorial_npc: "Royal Guide Isolde",
};

export const NPC_DIALOGUES = {
  "10,9": {
    start: {
      text: "The forest ahead is thick. Keep your eyes open and your path clear.",
      choices: DEFAULT_NPC_CHOICES,
    },
    help: {
      text: "Stay on the paths, check every chest you find, and speak to travelers when you are unsure where to go next.",
      choices: [{ id: "leave", label: "Thanks" }],
    },
    quest: {
      text: "Bring me 3 potions from the wild paths and I will know you are ready for the deeper forest.",
      choices: [{ id: "leave", label: "I'll do it" }],
    },
  },
  "20,15": {
    start: {
      text: "Some treasures are hidden in plain sight. Wander slowly and look twice.",
      choices: DEFAULT_NPC_CHOICES,
    },
    help: {
      text: "Watch the edges of the road and the clearings near water. Useful things are often placed where impatient travelers never stop.",
      choices: [{ id: "leave", label: "Understood" }],
    },
    quest: {
      text: "If you want to prove your focus, bring me 1 sword from a distant chest.",
      choices: [{ id: "leave", label: "I'll look for it" }],
    },
  },
  "25,7": {
    start: {
      text: "The road bends near the water. Travelers who rush usually miss something useful.",
      choices: DEFAULT_NPC_CHOICES,
    },
    help: {
      text: "Move carefully near the water and do not assume every safe route is straight. A slower path can still lead to better rewards.",
      choices: [{ id: "leave", label: "Good advice" }],
    },
    quest: {
      text: "Bring me 2 potions and I will tell you which road is safest beyond the river bend.",
      choices: [{ id: "leave", label: "I'll return with them" }],
    },
  },
  "10,21": {
    start: {
      text: "A steady adventurer always knows when to stop, listen, and move again.",
      choices: DEFAULT_NPC_CHOICES,
    },
    help: {
      text: "Check your surroundings before each move. If a path feels blocked, change direction instead of forcing your way through.",
      choices: [{ id: "leave", label: "I will" }],
    },
    quest: {
      text: "Show me patience by finding 3 potions before you continue your journey.",
      choices: [{ id: "leave", label: "Consider it done" }],
    },
  },
  "25,3": {
    start: {
      text: "The old stones remember every traveler. Leave this place a little wiser than you found it.",
      choices: DEFAULT_NPC_CHOICES,
    },
    help: {
      text: "Wisdom here is simple: explore thoroughly, learn the map, and return to those who seem to know more than they first reveal.",
      choices: [{ id: "leave", label: "Thanks for the wisdom" }],
    },
    quest: {
      text: "Bring me 1 sword so I know you can survive the dangers hidden among these stones.",
      choices: [{ id: "leave", label: "I'll bring it" }],
    },
  },
  "8,17": {
    start: {
      text: "You can speak to me whenever you need direction. Choose what you want to ask, and I will answer briefly.",
      choices: DEFAULT_NPC_CHOICES,
    },
    help: {
      text: "Explore the map, open chests when you can, and talk to nearby NPCs often. Guidance is hidden in small conversations.",
      choices: [{ id: "leave", label: "Got it" }],
    },
    quest: {
      text: "Bring me 3 potions and 1 sword, and I will know you have learned how to search the world properly.",
      choices: [{ id: "leave", label: "I'll gather them" }],
    },
  },
};

export const COMBAT_MOVES = {
  strike: {
    id: "strike",
    name: "Strike",
    power: 40,
    accuracy: 100,
    type: "physical",
    description: "A direct melee attack",
  },
  doubleSlash: {
    id: "doubleSlash",
    name: "Double Slash",
    power: 60,
    accuracy: 75,
    type: "physical",
    description: "Two quick strikes",
  },
  parry: {
    id: "parry",
    name: "Parry",
    power: 0,
    accuracy: 100,
    type: "defensive",
    description: "Reduce incoming damage",
  },
  fireball: {
    id: "fireball",
    name: "Fireball",
    power: 60,
    accuracy: 75,
    type: "magic",
    description: "Shoot a ball of fire",
  },
  kill: {
    id: "kill",
    name: "Kill",
    power: 9999,
    accuracy: 100,
    type: "physical",
    description: "Kill the enemy",
  },
};

export const ENEMIES = {
  goblin: {
    id: "goblin",
    name: "Goblin",
    sprite: "👺",
    maxHp: 70,
    attack: 8,
    defense: 4,
    speed: 6,
    moves: ["strike", "doubleSlash"],
  },
  dragon: {
    id: "dragon",
    name: "Dragon",
    sprite: "🐉",
    maxHp: 150,
    attack: 12,
    defense: 8,
    speed: 10,
    moves: ["strike", "fireball"],
  },
};

export const PLAYER_STATS = {
  maxHp: 100,
  attack: 15,
  defense: 10,
  speed: 12,
  moves: ["strike", "doubleSlash", "kill"],
};

//currently the map is constant

export const WORLD_DATA = {
  floor: Array(GRID_HEIGHT)
    .fill(null)
    .map((_, row) =>
      Array(GRID_WIDTH)
        .fill(null)
        .map((_, col) => {
          const waterRegions = [
            { top: 6, bottom: 8, left: 8, right: 12 },
            { top: 16, bottom: 18, left: 24, right: 28 },
          ];

          for (const region of waterRegions) {
            const { top, bottom, left, right } = region;
            const isInsideWater = row >= top && row <= bottom && col >= left && col <= right;

            if (!isInsideWater) {
              continue;
            }

            const isTop = row === top;
            const isBottom = row === bottom;
            const isLeft = col === left;
            const isRight = col === right;

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

          if (row >= 3 && row <= 4 && col >= 30 && col <= 35) return 2; // stone

          // Weighted Randomization: 70% gGrass1, 30% others
          const rand = Math.random();
          if (rand < 0.7) return "gGrass1";
          return `gGrass${Math.floor(Math.random() * 4) + 2}`; // Random 2-5
        }),
    ),

  objects: Array(GRID_HEIGHT)
    .fill(null)
    .map((_, row) =>
      Array(GRID_WIDTH)
        .fill(null)
        .map((_, col) => {
          if ((row === 4 && col === 22) || (row === 13 && col === 28) || (row === 20 && col === 16)) return "chestBlock";

          const houseAnchors = [
            [2, 20],
            [11, 15],
            [18, 5],
          ];

          for (const [r, c] of houseAnchors) {
            const houseTop = r - 2;
            const houseBottom = r;
            const houseLeft = c - 1;
            const houseRight = c + 2;

            if (row >= houseTop && row <= houseBottom && col >= houseLeft && col <= houseRight) {
              if (row === r && col === c) return "house";
              return "houseBlock";
            }
          }

          // 2x2 Tree Cluster Logic
          const treeAnchors = [
            [2, 3],
            [5, 6],
            [10, 4],
            [14, 8],
            [3, 15],
            [8, 18],
            [12, 22],
            [6, 32],
            [18, 14],
            [20, 35],
          ];
          for (const [r, c] of treeAnchors) {
            if (row === r && col === c) return "tree";
            if (row === r && col === c + 1) return "treeBlock";
            if (row === r + 1 && col === c) return "treeBlock";
            if (row === r + 1 && col === c + 1) return "treeBlock";
          }

          if ((row === 9 && col === 10) || (row === 15 && col === 20) || (row === 7 && col === 25) || (row === 21 && col === 10)) return "npc";
          return 0;
        }),
    ),

  interactive: Array(GRID_HEIGHT)
    .fill(null)
    .map((_, row) =>
      Array(GRID_WIDTH)
        .fill(null)
        .map((_, col) => {
          if ((row === 3 && col === 25) || (row === 17 && col === 8)) return 2; // npc
          if ((row >= 6 && row <= 8 && col >= 8 && col <= 12) || (row >= 16 && row <= 18 && col >= 24 && col <= 28)) return 3; // encounter tile
          return 0;
        }),
    ),
};

// Teleport metadata: [x,y] on current map -> { targetMap, targetX, targetY }
export const TELEPORTS = {
  forest: {
    "20,2": { targetMap: "house", targetX: 5, targetY: 6 },
    "15,11": { targetMap: "house", targetX: 5, targetY: 6 },
    "5,18": { targetMap: "house", targetX: 5, targetY: 6 },
  },
  house: {
    "5,7": { targetMap: "forest", targetX: 20, targetY: 3 },
  },
};

export const MAPS = {
  forest: {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    floor: WORLD_DATA.floor,
    objects: WORLD_DATA.objects,
    interactive: WORLD_DATA.interactive.map((row, rIdx) =>
      row.map((tile, cIdx) => {
        if ((rIdx === 2 && cIdx === 20) || (rIdx === 11 && cIdx === 15) || (rIdx === 18 && cIdx === 5)) return 4;
        return tile;
      }),
    ),
  },
  house: {
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

            if (row === 2 && col === 3) return "houseTable";
            if (row === 2 && col === 2) return "houseChair";
            if (row === 1 && col === 7) return "houseClayPot";
            if (row === 2 && col === 8) return "houseClayPot";
            if (row === 6 && col === 1) return "houseClayPot";
            if (row === 5 && col === 7) return "houseBucket";
            if (row === 5 && col === 2) return "houseBox";
            if (row === 1 && col === 1) return "houseBox";
            if (row === 3 && col === 3) return "chestBlock";

            // --- הוספת ה-NPC לקווסט ---
            if (row === 4 && col === 6) return "npc";

            return 0;
          }),
      ),
    interactive: Array(8)
      .fill(null)
      .map((_, row) =>
        Array(10)
          .fill(null)
          .map((_, col) => {
            if (row === 7 && col === 5) return 4; // Exit

            // --- הוספת התיבה לקווסט ---
            if (row === 3 && col === 3) return 0;

            return 0;
          }),
      ),
  },
};
