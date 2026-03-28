import grassSprite from "../assets/sprites/kingdom/gGrass1-5.png";
import treeSprite from "../assets/sprites/kingdom/gTree.png";
import playerIdleSprite from "../assets/sprites/player/playerIdle.png";
import playerWalkingSprite from "../assets/sprites/player/playerWalking.png";

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

  gGrass1: { img: grassSprite, posX: "0%", size: "500%" },
  gGrass2: { img: grassSprite, posX: "25%", size: "500%" },
  gGrass3: { img: grassSprite, posX: "50%", size: "500%" },
  gGrass4: { img: grassSprite, posX: "75%", size: "500%" },
  gGrass5: { img: grassSprite, posX: "100%", size: "500%" },

  // 2x2 Tree Mapping (Using the 32x32 gTree.png)
  gTreeTL: { img: treeSprite, posX: "0%", posY: "0%", size: "200%" },
  gTreeTR: { img: treeSprite, posX: "100%", posY: "0%", size: "200%" },
  gTreeBL: { img: treeSprite, posX: "0%", posY: "100%", size: "200%" },
  gTreeBR: { img: treeSprite, posX: "100%", posY: "100%", size: "200%" },
};
