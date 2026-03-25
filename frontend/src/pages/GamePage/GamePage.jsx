import style from "./GamePage.module.css";
import Game from "../../components/Game/Game";
import Combat from "../../components/Combat/Combat";
import Header from "../../components/Header/Header";
import { InventoryProvider } from "../../context/InventoryContext";
import { useState } from "react";

const GamePage = () => {
  const [combatData, setCombatData] = useState(null);
  const [playerGridPos, setPlayerGridPos] = useState({ x: 5, y: 5 }); //default position
  const [currentMapId, setCurrentMapId] = useState("forest");

  const triggerCombat = (enemyId) => {
    setCombatData({ enemyId, isActive: true });
  };

  const endCombat = () => {
    setCombatData(null);
  };

  return (
    <InventoryProvider>
      <div className={style.container}>
        {!combatData && (
          <>
            <Header />
            <Game 
              onCombatTrigger={triggerCombat} 
              playerGridPos={playerGridPos} 
              setPlayerGridPos={setPlayerGridPos} 
              currentMapId={currentMapId}
              setCurrentMapId={setCurrentMapId}
            />
          </>
        )}
        {combatData && <Combat enemyId={combatData.enemyId} onCombatEnd={endCombat} />}
      </div>
    </InventoryProvider>
  );
};

export default GamePage;
