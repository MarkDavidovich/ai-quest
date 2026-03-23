export const UNIT_SIZE = 64;
export const GRID_WIDTH = 40;
export const GRID_HEIGHT = 24;
export const CAMERA_WIDTH = 24;
export const CAMERA_HEIGHT = 12;
export const MOVE_DURATION = 150; // milliseconds for smooth movement animation
export const INVENTORY_SIZE = 12;

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

export const INITIAL_INVENTORY = Array.from({ length: INVENTORY_SIZE }, (_, index) => {
  if (index === 0) {
    return { itemId: "potion", quantity: 2 };
  }

  if (index === 1) {
    return { itemId: "sword", quantity: 1 };
  }

  return null;
});

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
};

export const toWorldKey = (x, y) => `${x},${y}`;

export const NPC_DIALOGUES = {
  "10,9":
    "The forest ahead is thick. Keep your eyes open and your path clear. The forest ahead is thick. Keep your eyes open and your path clear. The forest ahead is thick. Keep your eyes open and your path clear. The forest ahead is thick. Keep your eyes open and your path clear. The forest ahead is thick. Keep your eyes open and your path clear. The forest ahead is thick. Keep your eyes open and your path clear.",
  "20,15": "Some treasures are hidden in plain sight. Wander slowly and look twice.",
  "25,7": "The road bends near the water. Travelers who rush usually miss something useful.",
  "10,21": "A steady adventurer always knows when to stop, listen, and move again.",
  "25,3": "The old stones remember every traveler. Leave this place a little wiser than you found it.",
  "8,17": "Press Enter when you need to speak, and press it again when you're ready for the road.",
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
  moves: ["strike", "doubleSlash"],
};

//currently the map is constant

export const WORLD_DATA = {
  floor: Array(GRID_HEIGHT)
    .fill(null)
    .map((_, row) =>
      Array(GRID_WIDTH)
        .fill(null)
        .map((_, col) => {
          if ((row >= 6 && row <= 8 && col >= 8 && col <= 12) || (row >= 16 && row <= 18 && col >= 24 && col <= 28)) return "water"; // water
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
            return "tree";
          if ((row === 2 && col === 20) || (row === 11 && col === 15) || (row === 18 && col === 5)) return "house";
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
          if ((row === 4 && col === 22) || (row === 13 && col === 28) || (row === 20 && col === 16)) return 1; // chest
          if ((row === 3 && col === 25) || (row === 17 && col === 8)) return 2; // npc
          if ((row >= 6 && row <= 8 && col >= 8 && col <= 12) || (row >= 16 && row <= 18 && col >= 24 && col <= 28)) return 3; // encounter tile
          return 0;
        }),
    ),
};
