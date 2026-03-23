import { useState, useEffect } from "react";
import style from "./Combat.module.css";
import { CAMERA_HEIGHT, CAMERA_WIDTH, UNIT_SIZE, COMBAT_MOVES, ENEMIES, PLAYER_STATS } from "../../utils/constants";
import { calculateDamage, getRandomMove } from "../../utils/combatHelpers";
import PlayerCombatSprite from "../PlayerCombatSprite/PlayerCombatSprite";
import EnemyCombatSprite from "../EnemyCombatSprite/EnemyCombatSprite";
import CombatUI from "../CombatUI/CombatUI";

const Combat = ({ enemyId, onCombatEnd }) => {
  // ============================================
  // COMBAT STATE
  // ============================================

  const [isActive, setIsActive] = useState(false);
  const [playerHp, setPlayerHp] = useState(PLAYER_STATS.maxHp);
  const [enemyHp, setEnemyHp] = useState(0);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [battlePhase, setBattlePhase] = useState("waiting"); // "waiting" | "playerTurn" | "playerAttacking" | "enemyTurn" | "enemyAttacking" | "battleEnd"
  const [move, setSelectedMove] = useState(null);
  const [combatLog, setCombatLog] = useState([]);

  // ============================================
  // START COMBAT FUNCTION
  // ============================================

  useEffect(() => {
    if (enemyId) {
      startCombat(enemyId);
    }
  }, [enemyId]);

  const startCombat = (enemyId) => {
    const enemy = ENEMIES[enemyId];
    if (!enemy) return;

    setIsActive(true);
    setCurrentEnemy(enemy);
    setEnemyHp(enemy.maxHp);
    setPlayerHp(PLAYER_STATS.maxHp);
    setBattlePhase("playerTurn");
    setCombatLog([`A ${enemy.name} appeared!`]);
  };

  // ============================================
  // END COMBAT FUNCTION
  // ============================================

  const endCombat = (winner) => {
    // winner: "player" or "enemy"
    setIsActive(false);
    setCurrentEnemy(null);
    setBattlePhase("waiting");
    setCombatLog([]);
    onCombatEnd?.();
    // TODO: Give rewards if player wins, etc
  };

  // ============================================
  // HANDLE PLAYER ATTACK
  // ============================================

  const handlePlayerAttack = (move) => {
    console.log("handlePlayerAttack called, selectedMove:", move, "currentEnemy:", currentEnemy);
    if (!move || !currentEnemy) return;

    const result = calculateDamage(PLAYER_STATS, currentEnemy, move);

    let newLog = [...combatLog];
    let newEnemyHp = enemyHp;

    if (!result.hit) {
      newLog.push(`${move.name} missed!`);
    } else {
      newLog.push(`You hit for ${result.damage} damage!`);
      if (result.isCritical) {
        newLog.push("Critical hit!");
      }
      newEnemyHp = Math.max(0, enemyHp - result.damage);
    }

    setEnemyHp(newEnemyHp);
    setCombatLog(newLog);
    setSelectedMove(null);

    // Check if enemy is defeated
    if (newEnemyHp <= 0) {
      setBattlePhase("battleEnd");
      setCombatLog((prev) => [...prev, `${currentEnemy.name} was defeated!`]);
      return;
    }

    // Enemy's turn
    setTimeout(() => {
      handleEnemyTurn();
    }, 1000);
  };

  // ============================================
  // HANDLE ENEMY ATTACK
  // ============================================

  const handleEnemyTurn = () => {
    const enemyMove = getRandomMove(currentEnemy);
    const result = calculateDamage(currentEnemy, PLAYER_STATS, enemyMove);

    let newLog = [...combatLog];
    let newPlayerHp = playerHp;

    newLog.push(`${currentEnemy.name} used ${enemyMove.name}!`);

    if (!result.hit) {
      newLog.push(`${currentEnemy.name}'s attack missed!`);
    } else {
      newLog.push(`${currentEnemy.name} hit for ${result.damage} damage!`);
      if (result.isCritical) {
        newLog.push("Critical hit!");
      }
      newPlayerHp = Math.max(0, playerHp - result.damage);
    }

    setPlayerHp(newPlayerHp);
    setCombatLog(newLog);

    // Check if player is defeated
    if (newPlayerHp <= 0) {
      setBattlePhase("battleEnd");
      setCombatLog((prev) => [...prev, "You were defeated!"]);
      return;
    }

    // Back to player turn
    setBattlePhase("playerTurn");
  };

  // ============================================
  // HANDLE PLAYER MOVE SELECTION (UPDATED)
  // ============================================

  const handlePlayerMove = (moveId) => {
    if (battlePhase !== "playerTurn") return;

    const move = COMBAT_MOVES[moveId];
    if (!move) return;

    setSelectedMove(move);
    setBattlePhase("playerAttacking");

    // Start attack animation after a short delay
    setTimeout(() => {
      handlePlayerAttack(move);
    }, 800);
  };

  if (!isActive || !currentEnemy) {
    return null; // Don't render if combat not active
  }

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
          <CombatUI type="enemy" hp={enemyHp} maxHp={currentEnemy.maxHp} name={currentEnemy.name} />
          <EnemyCombatSprite enemy={currentEnemy} />
        </div>

        <div className={style.entity}>
          <PlayerCombatSprite />
          <CombatUI type="player" hp={playerHp} maxHp={PLAYER_STATS.maxHp} name="Hero" />
        </div>
      </div>

      {/* Combat Log */}
      <div className={style.combatLog}>
        {combatLog.slice(-3).map((log, i) => (
          <p key={i}>{log}</p>
        ))}
      </div>

      {/* Move Buttons - Only show during player turn */}
      {battlePhase === "playerTurn" && (
        <div className={style.moveButtons}>
          {PLAYER_STATS.moves.map((moveId) => {
            const move = COMBAT_MOVES[moveId];
            return (
              <button key={moveId} onClick={() => handlePlayerMove(moveId)} className={style.moveButton}>
                {move.name}
                <span className={style.movePower}>PWR: {move.power}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* End Combat Button - Show when battle ends */}
      {battlePhase === "battleEnd" && (
        <button onClick={() => endCombat()} className={style.endButton}>
          Continue
        </button>
      )}
    </div>
  );
};

export default Combat;
