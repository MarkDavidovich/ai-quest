import style from "./CombatUI.module.css";

const CombatUI = ({ type, hp, maxHp, name }) => {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div className={style.container}>
      <div className={style.name}>{name}</div>
      <div className={style.hpBarContainer}>
        <div className={style.hpBarFill} style={{ width: `${hpPercent}%` }}></div>
      </div>
      <div className={style.hpText}>
        {hp} / {maxHp}
      </div>
    </div>
  );
};
export default CombatUI;
