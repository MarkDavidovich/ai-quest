export const UNIT_SIZE = 64;
export const GRID_WIDTH = 40;
export const GRID_HEIGHT = 24;
export const CAMERA_WIDTH = 24;
export const CAMERA_HEIGHT = 12;
export const MOVE_DURATION = 150; // milliseconds for smooth movement animation

export const NPC_DIALOGUES = {
  "10,9": "The forest ahead is thick. Keep your eyes open and your path clear.",
  "20,15": "Some treasures are hidden in plain sight. Wander slowly and look twice.",
  "25,7": "The road bends near the water. Travelers who rush usually miss something useful.",
  "10,21": "A steady adventurer always knows when to stop, listen, and move again.",
  "25,3": "The old stones remember every traveler. Leave this place a little wiser than you found it.",
  "8,17": "Press Enter when you need to speak, and press it again when you're ready for the road.",
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
