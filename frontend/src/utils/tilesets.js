import grassSprite from "../assets/sprites/kingdom/gGrass1-5.png";
import treeSprite from "../assets/sprites/kingdom/gTree.png";
import basicHouseSprite from "../assets/sprites/kingdom/basicHouse1.png";
import basicHouseFloorSprite from "../assets/sprites/kingdom/basicHouse1Floor.png";
import basicHouseWallsSprite from "../assets/sprites/kingdom/basicHouse1Walls.png";
import playerIdleSprite from "../assets/sprites/player/playerIdle.png";
import playerWalkingSprite from "../assets/sprites/player/playerWalking.png";
import oldWomanNpcSprite from "../assets/sprites/kingdom/oldWomanNpc.png";

// --- THE SPRITE DICTIONARY ---
// Add any new pixel art tiles here, mapping them to explicit visual bounds on the spritesheets!
export const SPRITE_MAP = {
  // Idle States (1x4)
  playerIdleDown: { img: playerIdleSprite, posX: "0%", size: "400%" },
  playerIdleUp: { img: playerIdleSprite, posX: "33.33%", size: "400%" },
  playerIdleLeft: { img: playerIdleSprite, posX: "66.66%", size: "400%" },
  playerIdleRight: { img: playerIdleSprite, posX: "100%", size: "400%" },

  // Walking States (3x4)
  // We specify only the column; Player.jsx will calculate the Y offset frame-by-frame
  playerWalkingDown: { img: playerWalkingSprite, posX: "0%", size: "400%" },
  playerWalkingUp: { img: playerWalkingSprite, posX: "33.33%", size: "400%" },
  playerWalkingLeft: { img: playerWalkingSprite, posX: "66.66%", size: "400%" },
  playerWalkingRight: { img: playerWalkingSprite, posX: "100%", size: "400%" },

  //Old woman NPC
  npc: { img: oldWomanNpcSprite, posX: "0%", size: "100%" },

  // 4x3 house sprite, anchored so the doorway lines up with the existing house tile.
  house: {
    img: basicHouseSprite,
    posX: "0%",
    posY: "0%",
    size: "100% 100%",
    widthUnits: 4,
    heightUnits: 3,
    anchorX: 1,
    anchorY: 2,
  },

  houseFloorTL: { img: basicHouseFloorSprite, posX: "0%", posY: "0%", size: "300%" },
  houseFloorT: { img: basicHouseFloorSprite, posX: "50%", posY: "0%", size: "300%" },
  houseFloorTR: { img: basicHouseFloorSprite, posX: "100%", posY: "0%", size: "300%" },
  houseFloorL: { img: basicHouseFloorSprite, posX: "0%", posY: "50%", size: "300%" },
  houseFloorC: { img: basicHouseFloorSprite, posX: "50%", posY: "50%", size: "300%" },
  houseFloorR: { img: basicHouseFloorSprite, posX: "100%", posY: "50%", size: "300%" },
  houseFloorBL: { img: basicHouseFloorSprite, posX: "0%", posY: "100%", size: "300%" },
  houseFloorB: { img: basicHouseFloorSprite, posX: "50%", posY: "100%", size: "300%" },
  houseFloorBR: { img: basicHouseFloorSprite, posX: "100%", posY: "100%", size: "300%" },

  houseWallTL: { img: basicHouseWallsSprite, posX: "0%", posY: "0%", size: "500%" },
  houseWallTLeft: { img: basicHouseWallsSprite, posX: "25%", posY: "0%", size: "500%" },
  houseWallT: { img: basicHouseWallsSprite, posX: "50%", posY: "0%", size: "500%" },
  houseWallTRight: { img: basicHouseWallsSprite, posX: "75%", posY: "0%", size: "500%" },
  houseWallTR: { img: basicHouseWallsSprite, posX: "100%", posY: "0%", size: "500%" },

  houseWallLTop: { img: basicHouseWallsSprite, posX: "0%", posY: "25%", size: "500%" },
  houseWallRTop: { img: basicHouseWallsSprite, posX: "100%", posY: "25%", size: "500%" },

  houseWallL: { img: basicHouseWallsSprite, posX: "0%", posY: "50%", size: "500%" },
  houseWallR: { img: basicHouseWallsSprite, posX: "100%", posY: "50%", size: "500%" },

  houseWallLBottom: { img: basicHouseWallsSprite, posX: "0%", posY: "75%", size: "500%" },
  houseWallRBottom: { img: basicHouseWallsSprite, posX: "100%", posY: "75%", size: "500%" },

  houseWallBL: { img: basicHouseWallsSprite, posX: "0%", posY: "100%", size: "500%" },
  houseWallBLeft: { img: basicHouseWallsSprite, posX: "25%", posY: "100%", size: "500%" },
  houseWallB: { img: basicHouseWallsSprite, posX: "50%", posY: "100%", size: "500%" },
  houseWallBRight: { img: basicHouseWallsSprite, posX: "75%", posY: "100%", size: "500%" },
  houseWallBR: { img: basicHouseWallsSprite, posX: "100%", posY: "100%", size: "500%" },

  //Grass variable sprite
  gGrass1: { img: grassSprite, posX: "0%", size: "500%" },
  gGrass2: { img: grassSprite, posX: "25%", size: "500%" },
  gGrass3: { img: grassSprite, posX: "50%", size: "500%" },
  gGrass4: { img: grassSprite, posX: "75%", size: "500%" },
  gGrass5: { img: grassSprite, posX: "100%", size: "500%" },

  // 2x2 tree sprite anchored at its top-left tile.
  tree: {
    img: treeSprite,
    posX: "0%",
    posY: "0%",
    size: "100% 100%",
    widthUnits: 2,
    heightUnits: 2,
    anchorX: 0,
    anchorY: 0,
  },
};
