import grassSprite from "../assets/sprites/kingdom/gGrass1-5.png";
import treeSprite from "../assets/sprites/kingdom/gTree.png";

// --- THE SPRITE DICTIONARY ---
// Add any new pixel art tiles here, mapping them to explicit visual bounds on the spritesheets!
export const SPRITE_MAP = {
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
