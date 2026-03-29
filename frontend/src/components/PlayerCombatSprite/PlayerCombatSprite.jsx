import { SPRITE_MAP } from "../../utils/tilesets";
import style from "./PlayerCombatSprite.module.css";

const PlayerCombatSprite = ({ className }) => {
  // Using the overworld idle-right sprite
  const sprite = SPRITE_MAP.playerIdleRight;

  return (
    <div
      className={`${style.player} ${className || ""}`}
      style={{
        backgroundImage: `url(${sprite.img})`,
        backgroundPosition: `${sprite.posX} ${sprite.posY || "0%"}`,
        backgroundSize: sprite.size,
      }}
    />
  );
};
export default PlayerCombatSprite;
