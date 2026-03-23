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

const DEFAULT_NPC_CHOICES = [
  { id: "help", label: "What should I do?" },
  { id: "quest", label: "Do you have a quest?" },
  { id: "leave", label: "Goodbye" },
];

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
          return 0;
        }),
    ),
};
