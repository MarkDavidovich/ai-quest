import { createForestLevel } from "../maps/forest.js";
import { createDeepForestLevel } from "../maps/deepForest.js";
import { createPlayerHouseMap } from "../maps/playerHouse.js";
import { createGHouse1Map } from "../maps/gHouse1.js";
import { createGHouse2Map } from "../maps/gHouse2.js";
import { createChiefHouseMap } from "../maps/chiefHouse.js";

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
    name: "Life Potion",
    icon: "itemLifePot",
    kind: "consumable",
    stackable: true,
    maxHpRegen: 30, // Heals for 30 HP
    maxStack: 99,
  },
  sword: {
    id: "sword",
    name: "Iron Sword",
    icon: "⚔️",
    kind: "equipment",
    stackable: false,
    maxStack: 1,
  },
  bear_leather: {
    id: "bear_leather",
    name: "Bear Leather",
    icon: "itemBearLeather",
    kind: "loot",
    stackable: true,
    maxStack: 99,
  },
  dino_bone: {
    id: "dino_bone",
    name: "Dino Bone",
    icon: "itemDinoBone",
    kind: "loot",
    stackable: true,
    maxStack: 99,
  },
  goblin_flask: {
    id: "goblin_flask",
    name: "Goblin Flask",
    icon: "itemGoblinFlask",
    kind: "loot",
    stackable: true,
    maxStack: 99,
  },
  dragon_meat: {
    id: "dragon_meat",
    name: "Dragon Meat",
    icon: "itemDragonMeat",
    kind: "loot",
    stackable: true,
    maxStack: 99,
  },
};

export const INITIAL_INVENTORY = Array.from({ length: INVENTORY_SIZE }, () => null);

export const INITIAL_WORLD_LOOT = {
  "3,3": {
    kind: "chest",
    opened: false,
    drops: [{ itemId: "potion", quantity: 15 }],
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
  "gHouse2:6,4": "Mira",
  "chiefHouse:6,4": "Elder Rowan",
  tutorial_npc: "Royal Guide Isolde",
  "deepForest:37,4": "Dragon Tamer",
};

export const NPC_OBJECT_TYPES = ["npc", "oldManNpc", "oldManNpc2", "villageLeaderNpc", "dragonTamerNpc"];

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
  "gHouse2:6,4": {
    start: {
      text: "This house is quieter than the square outside. I like keeping an eye on the village from here.",
      choices: DEFAULT_NPC_CHOICES,
    },
    help: {
      text: "If you are ever lost, use the houses and paths as landmarks. The village is small, but it has a rhythm to it.",
      choices: [{ id: "leave", label: "Helpful" }],
    },
    quest: {
      text: "No task right now. I'm just keeping things tidy and listening for trouble.",
      choices: [{ id: "leave", label: "Understood" }],
    },
  },
  "chiefHouse:6,4": {
    start: {
      text: "Welcome. I am Elder Rowan, and this house is where the village's decisions are made.",
      choices: DEFAULT_NPC_CHOICES,
    },
    help: {
      text: "Speak to the villagers, learn the paths between the homes, and return here when you need direction. A village reveals itself slowly.",
      choices: [{ id: "leave", label: "Thanks" }],
    },
    quest: {
      text: "For now, simply explore. Once you know the people and their homes, I will have more for you.",
      choices: [{ id: "leave", label: "I will" }],
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
    "deepForest:37,4": {
      start: {
        text: "I am the keeper of the ancient dinos. You've wandered into their domain. Are you prepared to face them?",
        choices: [
          { id: "fight", label: "Face the dino!" },
          { id: "ask", label: "Tell me more" },
          { id: "leave", label: "I'll come back later" },
        ],
      },
      fight: {
        text: "Brave choice. The dino awaits you.",
        choices: [],
      },
      ask: {
        text: "The dinos are ancient, powerful, and territorial. Many have tried to best them. Few have succeeded.",
        choices: [
          { id: "fight", label: "I'll fight anyway" },
          { id: "leave", label: "Maybe I'm not ready" },
        ],
      },
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
  bite: {
    id: "bite",
    name: "Bite",
    power: 45,
    accuracy: 95,
    type: "physical",
    description: "A sharp, snapping bite",
  },
  slash: {
    id: "slash",
    name: "Slash",
    power: 55,
    accuracy: 90,
    type: "physical",
    description: "A wide, sweeping cut",
  },
  tailWhip: {
    id: "tailWhip",
    name: "Tail Whip",
    power: 40,
    accuracy: 100,
    type: "physical",
    description: "A quick strike with the tail",
  },
  stomp: {
    id: "stomp",
    name: "Stomp",
    power: 70,
    accuracy: 70,
    type: "physical",
    description: "A heavy, crushing blow",
  },
  fireBreath: {
    id: "fireBreath",
    name: "Fire Breath",
    power: 85,
    accuracy: 80,
    type: "magic",
    description: "Exhale a massive wave of heat",
  },
};

export const ENEMIES = {
  goblin: {
    id: "goblin",
    name: "Goblin",
    sprite: "enemyGoblin",
    maxHp: 70,
    attack: 8,
    defense: 4,
    speed: 6,
    moves: ["strike", "doubleSlash"],
    dropTable: [
      { itemId: "potion", chance: 0.2, quantity: 1 },
      { itemId: "goblin_flask", chance: 0.15, quantity: 1 },
    ],
  },
  dragon: {
    id: "dragon",
    name: "Dragon",
    sprite: "enemyDragon",
    maxHp: 200,
    attack: 25,
    defense: 15,
    speed: 15,
    moves: ["strike", "fireball", "fireBreath"],
    dropTable: [
      { itemId: "potion", chance: 0.5, quantity: 2 },
      { itemId: "dragon_meat", chance: 1, quantity: 1 },
    ],
  },
  bear: {
    id: "bear",
    name: "Forest Bear",
    sprite: "enemyBear",
    maxHp: 120,
    attack: 18,
    defense: 10,
    speed: 8,
    moves: ["strike", "bite", "slash"],
    dropTable: [{ itemId: "bear_leather", chance: 1, quantity: 1 }],
  },
  dino: {
    id: "dino",
    name: "Wild Dino",
    sprite: "enemyDino",
    maxHp: 100,
    attack: 15,
    defense: 8,
    speed: 12,
    moves: ["strike", "stomp", "tailWhip"],
    dropTable: [{ itemId: "dino_bone", chance: 0.5, quantity: 1 }],
  },
  lizard: {
    id: "lizard",
    name: "Giant Lizard",
    sprite: "enemyLizard",
    maxHp: 60,
    attack: 10,
    defense: 5,
    speed: 14,
    moves: ["bite", "tailWhip"],
    dropTable: [{ itemId: "potion", chance: 0.1, quantity: 1 }],
  },
};

export const PLAYER_STATS = {
  maxHp: 100,
  attack: 15,
  defense: 10,
  speed: 12,
  moves: ["strike", "doubleSlash", "kill"],
};

const FOREST_LEVEL = createForestLevel({ GRID_WIDTH, GRID_HEIGHT, toWorldKey });
const DEEP_FOREST_LEVEL = createDeepForestLevel({ GRID_WIDTH, GRID_HEIGHT, toWorldKey });
const PLAYER_HOUSE_MAP = createPlayerHouseMap();
const G_HOUSE_1_MAP = createGHouse1Map();
const G_HOUSE_2_MAP = createGHouse2Map();
const CHIEF_HOUSE_MAP = createChiefHouseMap();

export const WORLD_DATA = FOREST_LEVEL.worldData;

// Teleport metadata: [x,y] on current map -> { targetMap, targetX, targetY }
export const TELEPORTS = {
  forest: FOREST_LEVEL.teleports,
  deepForest: DEEP_FOREST_LEVEL.teleports,
  playerHouse: {
    "5,7": { targetMap: "forest", targetX: 10, targetY: 16 },
  },
  gHouse1: {
    "5,7": { targetMap: "forest", targetX: 4, targetY: 6 },
  },
  gHouse2: {
    "5,7": { targetMap: "forest", targetX: 34, targetY: 6 },
  },
  chiefHouse: {
    "5,7": { targetMap: "forest", targetX: 21, targetY: 13 },
  },
};

export const MAPS = {
  forest: FOREST_LEVEL.map,
  deepForest: DEEP_FOREST_LEVEL.map,
  playerHouse: PLAYER_HOUSE_MAP,
  gHouse1: G_HOUSE_1_MAP,
  gHouse2: G_HOUSE_2_MAP,
  chiefHouse: CHIEF_HOUSE_MAP,
};
