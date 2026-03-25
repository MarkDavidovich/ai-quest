import style from "./GamePage.module.css";
import Game from "../../components/Game/Game";
import Combat from "../../components/Combat/Combat";
import Header from "../../components/Header/Header";
import TransitionOverlay from "../../components/TransitionOverlay/TransitionOverlay";
import { CAMERA_HEIGHT, CAMERA_WIDTH, UNIT_SIZE, PLAYER_STATS } from "../../utils/constants";
import { InventoryProvider } from "../../context/InventoryContext";
import { useState } from "react";

const GamePage = () => {
  const [combatData, setCombatData] = useState(null);
  const [playerGridPos, setPlayerGridPos] = useState({ x: 5, y: 5 }); //default position
  const [currentMapId, setCurrentMapId] = useState("forest");
  const [playerHp, setPlayerHp] = useState(PLAYER_STATS.maxHp);
  const [transition, setTransition] = useState({ step: "closed", type: "map" });

  const handleItemUse = (itemId) => {
    if (itemId === "potion") {
      // Heal 50 HP, but don't exceed max
      setPlayerHp((prev) => Math.min(PLAYER_STATS.maxHp, prev + 50));
    }
  };

  const triggerTransition = async (type, onCommit) => {
    setTransition({ step: "entering", type });

    // 2. Wait for cover animation (0.5s)
    await new Promise((resolve) => setTimeout(resolve, 500));
    setTransition({ step: "black", type });

    // 3. Commit the state change (swap map or start battle)
    onCommit();

    // 4. Brief pause for render stability (increased for better masking)
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 5. Retreat transition
    setTransition({ step: "exiting", type });

    // 6. Cleanup
    await new Promise((resolve) => setTimeout(resolve, 300));
    setTransition({ step: "closed", type });
  };

  const triggerCombat = (enemyId) => {
    setCombatData({ enemyId, isActive: true });
  };

  const endCombat = () => {
    triggerTransition("map", () => setCombatData(null));
  };

  const gameWidth = `${CAMERA_WIDTH * UNIT_SIZE}px`;
  const gameHeight = `${CAMERA_HEIGHT * UNIT_SIZE}px`;

  return (
    <InventoryProvider>
      <div className={style.container}>
        <Header isBattle={Boolean(combatData)} playerHp={playerHp} onUseItem={handleItemUse} />

        <div
          className={style.gameWrapper}
          style={{
            width: gameWidth,
            height: gameHeight,
            minWidth: gameWidth,
            minHeight: gameHeight,
          }}
        >
          {!combatData && (
            <Game
              onCombatTrigger={triggerCombat}
              playerGridPos={playerGridPos}
              setPlayerGridPos={setPlayerGridPos}
              currentMapId={currentMapId}
              setCurrentMapId={setCurrentMapId}
              triggerTransition={triggerTransition}
              isTransitioning={transition.step !== "closed"}
            />
          )}
          {combatData && <Combat enemyId={combatData.enemyId} onCombatEnd={endCombat} playerHp={playerHp} setPlayerHp={setPlayerHp} />}

          <TransitionOverlay step={transition.step} type={transition.type} />
        </div>
      </div>
    </InventoryProvider>
  );
};

export default GamePage;
