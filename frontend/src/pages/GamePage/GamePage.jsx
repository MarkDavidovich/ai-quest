import style from "./GamePage.module.css";
import Game from "../../components/Game/Game";
import Combat from "../../components/Combat/Combat";

const GamePage = () => {
  return (
    <div className={style.container}>
      <Game />
      <Combat />
    </div>
  );
};

export default GamePage;
