import style from "./CombatUI.module.css";

const CombatUI = () => {
  const maxHp = 100;
  const currHp = 60;

  return (
    <div className={style.container}>
      <div>LEVEL:999</div>
      <div>HP:BAR</div>
    </div>
  );
};
export default CombatUI;
