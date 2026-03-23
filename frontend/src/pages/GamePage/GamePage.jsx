import style from "./GamePage.module.css";
import Game from "../../components/Game/Game";
import Combat from "../../components/Combat/Combat";
import Header from "../../components/Header/Header";

const GamePage = () => {
  return (
    <div className={style.container}>
      <Header />
      <Game />
      <Combat />
    </div>
  );
};

export default GamePage;
