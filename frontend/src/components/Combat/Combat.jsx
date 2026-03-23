import style from "./Combat.module.css";
import { CAMERA_HEIGHT, CAMERA_WIDTH, UNIT_SIZE } from "../../utils/constants";
import PlayerCombatSprite from "../PlayerCombatSprite/PlayerCombatSprite";
import EnemyCombatSprite from "../EnemyCombatSprite/EnemyCombatSprite";
import CombatUI from "../CombatUI/CombatUI";

const Combat = () => {
  return (
    <div
      className={style.container}
      style={{
        "--viewport-width": `${CAMERA_WIDTH * UNIT_SIZE}px`,
        "--viewport-height": `${CAMERA_HEIGHT * UNIT_SIZE}px`,
      }}
    >
      <div className={style.border}>
        <div className={style.entity}>
          <CombatUI />
          <EnemyCombatSprite />
        </div>
        <div className={style.entity}>
          <PlayerCombatSprite />
          <CombatUI />
        </div>
      </div>
    </div>
  );
};

export default Combat;
