import style from "./CombatUI.module.css";

const CombatUI = ({ hp, maxHp, name }) => {
  return (
    <div className={style.container}>
      <div>{name}</div>
      <div>{hp + "/" + maxHp}</div>
    </div>
  );
};
export default CombatUI;
