import style from "./EnemyCombatSprite.module.css";

const EnemyCombatSprite = ({ enemy }) => {
  return <div className={style.enemy}>{enemy.sprite}</div>;
};
export default EnemyCombatSprite;
