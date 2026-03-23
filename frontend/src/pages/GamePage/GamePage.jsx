import style from "./GamePage.module.css";
import Game from "../../components/Game/Game";
import Combat from "../../components/Combat/Combat";
import Header from "../../components/Header/Header";
import { InventoryProvider } from "../../context/InventoryContext";

const GamePage = () => {
  return (
    <InventoryProvider>
      <div className={style.container}>
        <Header />
        <Game />
        <Combat />
      </div>
    </InventoryProvider>
  );
};

export default GamePage;
