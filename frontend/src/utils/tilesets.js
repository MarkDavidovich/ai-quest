import grassSprite from "../assets/sprites/kingdom/gGrass1-5.png";
import dirtFieldSprite from "../assets/sprites/kingdom/gDirtField.png";
import dirtPathSprite from "../assets/sprites/kingdom/gDirtPath.png";
import bushesSprite from "../assets/sprites/kingdom/gBushes.png";
import flowersSprite from "../assets/sprites/kingdom/gFlowers.png";
import stumpsSprite from "../assets/sprites/kingdom/gStumps.png";
import treeSprite from "../assets/sprites/kingdom/gTree.png";
import waterSprite from "../assets/sprites/kingdom/gWater.png";
import basicHouseSprite from "../assets/sprites/kingdom/basicHouse1.png";
import basicHouse2Sprite from "../assets/sprites/kingdom/basicHouse2.png";
import abandonedHouse1Sprite from "../assets/sprites/kingdom/abandonedHouse1.png";
import abandonedHouse2Sprite from "../assets/sprites/kingdom/abandonedHouse2.png";
import basicHouseEntranceSprite from "../assets/sprites/kingdom/basicHouseEntrance.png";
import basicHouseInteriorSprite from "../assets/sprites/kingdom/basicHouseInterior.png";
import basicHouseFloorSprite from "../assets/sprites/kingdom/basicHouse1Floor.png";
import basicHouseWallsSprite from "../assets/sprites/kingdom/basicHouse1Walls.png";
import chestSprite from "../assets/sprites/kingdom/chest.png";
import flagSprite from "../assets/sprites/kingdom/flag.gif";
import waterRipplesSprite from "../assets/sprites/kingdom/water ripples.gif";
import playerIdleSprite from "../assets/sprites/player/playerIdle.png";
import playerWalkingSprite from "../assets/sprites/player/playerWalking.png";
import oldWomanNpcSprite from "../assets/sprites/kingdom/oldWomanNpc.png";
import oldManNpcSprite from "../assets/sprites/kingdom/oldManNpc.png";
import oldManNpc2Sprite from "../assets/sprites/kingdom/oldManNpc2.png";
import villageLeaderNpcSprite from "../assets/sprites/kingdom/villageLeaderNpc.png";
import deepTreeSprite from "../assets/sprites/kingdom/dTree.png";
import deepRootsAndStumpSprite from "../assets/sprites/kingdom/dRootsAndStump.png";
import deepCartSprite from "../assets/sprites/kingdom/dCart.png";
import goblinSprite from "../assets/sprites/kingdom/goblin.png";
import bearSprite from "../assets/sprites/kingdom/bear.png";
import dinoSprite from "../assets/sprites/kingdom/dino.png";
import dinoNpcSprite from "../assets/sprites/kingdom/dinoNpc.png";
import dragonSprite from "../assets/sprites/kingdom/dragon.png";
import lizardSprite from "../assets/sprites/kingdom/lizard.png";
import bearMeatSprite from "../assets/sprites/kingdom/bearMeat.png";
import dinoBoneSprite from "../assets/sprites/kingdom/dinoBone.png";
import gobinFlaskSprite from "../assets/sprites/kingdom/goblinFlask.png";
import lifePotSprite from "../assets/sprites/kingdom/lifePot.png";

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
  oldManNpc: { img: oldManNpcSprite, posX: "0%", size: "100%" },
  oldManNpc2: { img: oldManNpc2Sprite, posX: "0%", size: "100%" },
  villageLeaderNpc: { img: villageLeaderNpcSprite, posX: "0%", size: "100%" },
  flag: { img: flagSprite, posX: "0%", posY: "0%", size: "100% 100%" },
  waterRipples: { img: waterRipplesSprite, posX: "0%", posY: "0%", size: "100% 100%" },

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
  house2: {
    img: basicHouse2Sprite,
    posX: "0%",
    posY: "0%",
    size: "100% 100%",
    widthUnits: 4,
    heightUnits: 3,
    anchorX: 1,
    anchorY: 2,
  },
  abandonedHouse1: {
    img: abandonedHouse1Sprite,
    posX: "0%",
    posY: "0%",
    size: "100% 100%",
    widthUnits: 4,
    heightUnits: 3,
    anchorX: 1,
    anchorY: 2,
  },
  abandonedHouse2: {
    img: abandonedHouse2Sprite,
    posX: "0%",
    posY: "0%",
    size: "100% 100%",
    widthUnits: 3,
    heightUnits: 3,
    anchorX: 1,
    anchorY: 2,
  },

  houseEntrance: { img: basicHouseEntranceSprite, posX: "0%", posY: "0%", size: "100% 100%" },

  houseChair: { img: basicHouseInteriorSprite, posX: "0%", posY: "0%", size: "300%" },
  houseTable: { img: basicHouseInteriorSprite, posX: "50%", posY: "0%", size: "300%" },
  houseClayPot: { img: basicHouseInteriorSprite, posX: "100%", posY: "0%", size: "300%" },
  houseBox: { img: basicHouseInteriorSprite, posX: "0%", posY: "100%", size: "300%" },
  houseBucket: { img: basicHouseInteriorSprite, posX: "50%", posY: "100%", size: "300%" },
  housePotion: { img: basicHouseInteriorSprite, posX: "100%", posY: "100%", size: "300%" },

  chestClosed: { img: chestSprite, posX: "0%", posY: "0%", size: "200%" },
  chestOpen: { img: chestSprite, posX: "100%", posY: "0%", size: "200%" },

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

  gBush1: { img: bushesSprite, posX: "0%", posY: "0%", size: "200% 100%" },
  gBush2: { img: bushesSprite, posX: "100%", posY: "0%", size: "200% 100%" },

  gFlower1: { img: flowersSprite, posX: "0%", posY: "0%", size: "300% 100%" },
  gFlower2: { img: flowersSprite, posX: "50%", posY: "0%", size: "300% 100%" },
  gFlower3: { img: flowersSprite, posX: "100%", posY: "0%", size: "300% 100%" },

  gStump1: { img: stumpsSprite, posX: "0%", posY: "0%", size: "200% 100%" },
  gStump2: { img: stumpsSprite, posX: "100%", posY: "0%", size: "200% 100%" },
  dRoots1: { img: deepRootsAndStumpSprite, posX: "0%", posY: "0%", size: "300% 100%" },
  dRoots2: { img: deepRootsAndStumpSprite, posX: "50%", posY: "0%", size: "300% 100%" },
  dStump: { img: deepRootsAndStumpSprite, posX: "100%", posY: "0%", size: "300% 100%" },

  dirtFieldTL: { img: dirtFieldSprite, posX: "0%", posY: "0%", size: "300%" },
  dirtFieldT: { img: dirtFieldSprite, posX: "50%", posY: "0%", size: "300%" },
  dirtFieldTR: { img: dirtFieldSprite, posX: "100%", posY: "0%", size: "300%" },
  dirtFieldL: { img: dirtFieldSprite, posX: "0%", posY: "50%", size: "300%" },
  dirtFieldC: { img: dirtFieldSprite, posX: "50%", posY: "50%", size: "300%" },
  dirtFieldR: { img: dirtFieldSprite, posX: "100%", posY: "50%", size: "300%" },
  dirtFieldBL: { img: dirtFieldSprite, posX: "0%", posY: "100%", size: "300%" },
  dirtFieldB: { img: dirtFieldSprite, posX: "50%", posY: "100%", size: "300%" },
  dirtFieldBR: { img: dirtFieldSprite, posX: "100%", posY: "100%", size: "300%" },

  dirtPathVerticalTop: { img: dirtPathSprite, posX: "0%", posY: "0%", size: "400% 300%" },
  dirtPathVerticalMiddle: { img: dirtPathSprite, posX: "0%", posY: "50%", size: "400% 300%" },
  dirtPathVerticalBottom: { img: dirtPathSprite, posX: "0%", posY: "100%", size: "400% 300%" },
  dirtPathHorizontalLeft: { img: dirtPathSprite, posX: "33.33%", posY: "0%", size: "400% 300%" },
  dirtPathHorizontalMiddle: { img: dirtPathSprite, posX: "66.66%", posY: "0%", size: "400% 300%" },
  dirtPathHorizontalRight: { img: dirtPathSprite, posX: "100%", posY: "0%", size: "400% 300%" },
  dirtPathCornerTL: { img: dirtPathSprite, posX: "33.33%", posY: "50%", size: "400% 300%" },
  dirtPathCornerTR: { img: dirtPathSprite, posX: "66.66%", posY: "50%", size: "400% 300%" },
  dirtPatchSmall: { img: dirtPathSprite, posX: "100%", posY: "50%", size: "400% 300%" },
  dirtPathCornerBL: { img: dirtPathSprite, posX: "33.33%", posY: "100%", size: "400% 300%" },
  dirtPathCornerBR: { img: dirtPathSprite, posX: "66.66%", posY: "100%", size: "400% 300%" },

  // Temporary aliases so existing map data keeps rendering while we remap dirt placement.
  dirtOuterTL: { img: dirtFieldSprite, posX: "0%", posY: "0%", size: "300%" },
  dirtTop: { img: dirtFieldSprite, posX: "50%", posY: "0%", size: "300%" },
  dirtOuterTR: { img: dirtFieldSprite, posX: "100%", posY: "0%", size: "300%" },
  dirtInnerTL: { img: dirtFieldSprite, posX: "0%", posY: "0%", size: "300%" },
  dirtInnerTR: { img: dirtFieldSprite, posX: "100%", posY: "0%", size: "300%" },
  dirtLeft: { img: dirtFieldSprite, posX: "0%", posY: "50%", size: "300%" },
  dirtCenter: { img: dirtFieldSprite, posX: "50%", posY: "50%", size: "300%" },
  dirtRight: { img: dirtFieldSprite, posX: "100%", posY: "50%", size: "300%" },
  dirtTransitionLeftBottom: { img: dirtFieldSprite, posX: "0%", posY: "100%", size: "300%" },
  dirtTransitionRightBottom: { img: dirtFieldSprite, posX: "100%", posY: "100%", size: "300%" },
  dirtOuterBL: { img: dirtFieldSprite, posX: "0%", posY: "100%", size: "300%" },
  dirtBottom: { img: dirtFieldSprite, posX: "50%", posY: "100%", size: "300%" },
  dirtOuterBR: { img: dirtFieldSprite, posX: "100%", posY: "100%", size: "300%" },
  dirtTransitionLeftTop: { img: dirtFieldSprite, posX: "0%", posY: "0%", size: "300%" },
  dirtTransitionRightTop: { img: dirtFieldSprite, posX: "100%", posY: "0%", size: "300%" },
  dirtInnerBL: { img: dirtFieldSprite, posX: "0%", posY: "100%", size: "300%" },
  dirtInnerBR: { img: dirtFieldSprite, posX: "100%", posY: "100%", size: "300%" },
  dirtGrassDetail: { img: dirtPathSprite, posX: "100%", posY: "50%", size: "400% 300%" },

  gWaterTL: { img: waterSprite, posX: "0%", posY: "0%", size: "300%" },
  gWaterT: { img: waterSprite, posX: "50%", posY: "0%", size: "300%" },
  gWaterTR: { img: waterSprite, posX: "100%", posY: "0%", size: "300%" },
  gWaterL: { img: waterSprite, posX: "0%", posY: "50%", size: "300%" },
  gWaterC: { img: waterSprite, posX: "50%", posY: "50%", size: "300%" },
  gWaterR: { img: waterSprite, posX: "100%", posY: "50%", size: "300%" },
  gWaterBL: { img: waterSprite, posX: "0%", posY: "100%", size: "300%" },
  gWaterB: { img: waterSprite, posX: "50%", posY: "100%", size: "300%" },
  gWaterBR: { img: waterSprite, posX: "100%", posY: "100%", size: "300%" },

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
  dTree: {
    img: deepTreeSprite,
    posX: "0%",
    posY: "0%",
    size: "100% 100%",
    widthUnits: 2,
    heightUnits: 2,
    anchorX: 0,
    anchorY: 0,
  },
  dCart: {
    img: deepCartSprite,
    posX: "0%",
    posY: "0%",
    size: "100% 100%",
    widthUnits: 2,
    heightUnits: 2,
    anchorX: 0,
    anchorY: 1,
  },
  enemyGoblin: { img: goblinSprite, posX: "0%", posY: "0%", size: "100%" },
  enemyBear: { img: bearSprite, posX: "0%", posY: "0%", size: "100%" },
  enemyDino: { img: dinoSprite, posX: "0%", posY: "0%", size: "100%" },
  npcDino: { img: dinoNpcSprite, posX: "0%", posY: "0%", size: "100%" },
  enemyDragon: { img: dragonSprite, posX: "0%", posY: "0%", size: "100%" },
  enemyLizard: { img: lizardSprite, posX: "0%", posY: "0%", size: "100%" },
  itemLifePot: { img: lifePotSprite, posX: "0%", posY: "0%", size: "100%" },
  itemBearMeat: { img: bearMeatSprite, posX: "0%", posY: "0%", size: "100%" },
  itemDinoBone: { img: dinoBoneSprite, posX: "0%", posY: "0%", size: "100%" },
  itemGoblinFlask: { img: gobinFlaskSprite, posX: "0%", posY: "0%", size: "100%" },
};
