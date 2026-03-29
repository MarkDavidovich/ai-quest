import { SPRITE_MAP } from "../../utils/tilesets";
import style from "./EnemyCombatSprite.module.css";

const EnemyCombatSprite = ({ enemy }) => {
  const sprite = SPRITE_MAP[enemy.sprite];

  // Fallback to emoji if sprite mapping not found
  if (!sprite) {
    return <div className={style.enemy}>{enemy.sprite}</div>;
  }

  return (
    <div
      className={style.enemy}
      style={{
        backgroundImage: `url(${sprite.img})`,
        backgroundPosition: `${sprite.posX} ${sprite.posY || "0%"}`,
        backgroundSize: sprite.size,
      }}
    />
  );
};
export default EnemyCombatSprite;
