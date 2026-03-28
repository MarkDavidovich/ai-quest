import { useState, useEffect } from "react";
import style from "./Combat.module.css";
import { CAMERA_HEIGHT, CAMERA_WIDTH, UNIT_SIZE, COMBAT_MOVES, ENEMIES, PLAYER_STATS, EMPTY_DIALOGUE } from "../../utils/constants";
import { calculateDamage, getRandomMove } from "../../utils/combatHelpers";
import PlayerCombatSprite from "../PlayerCombatSprite/PlayerCombatSprite";
import EnemyCombatSprite from "../EnemyCombatSprite/EnemyCombatSprite";
import CombatUI from "../CombatUI/CombatUI";
import DialogueModal from "../DialogueModal/DialogueModal";

const Combat = ({ enemyId, onCombatEnd, playerHp, setPlayerHp }) => {
  // ============================================
  // COMBAT STATE
  // ============================================

  const [isActive, setIsActive] = useState(false);
  // playerHp is now managed by props
  const [enemyHp, setEnemyHp] = useState(0);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [battlePhase, setBattlePhase] = useState("waiting"); // "waiting" | "playerTurn" | "playerAttacking" | "enemyTurn" | "enemyAttacking" | "battleEnd"
  const [move, setSelectedMove] = useState(null);
  const [dialogue, setDialogue] = useState(EMPTY_DIALOGUE);
  const [actionResult, setActionResult] = useState(null);

  const handleChoiceSelect = (choiceId) => {
    if (choiceId === "attack") {
      //Show skills
      setDialogue({
        isOpen: true,
        text: "Select an attack:",
        choices: PLAYER_STATS.moves.map((id) => ({
          id,
          label: `${COMBAT_MOVES[id].name} `,
        })),
      });
    } else if (choiceId === "run") {
      const escapeChance = Math.random();
      if (escapeChance < 0.7) {
        setBattlePhase("battleEnd");
        setDialogue({ isOpen: true, text: "Got away safely!", choices: [] });
      } else {
        setBattlePhase("enemyTurnStarting");
        setDialogue({ isOpen: true, text: "You tried to run, but couldn't escape!", choices: [] });
      }
    } else {
      //It's a moveId
      handlePlayerMove(choiceId);
    }
  };

  const advanceDialogue = () => {
    // Only advance if there are no choices and the modal is open
    if (dialogue.isOpen && dialogue.choices.length === 0) {
      setDialogue(EMPTY_DIALOGUE);
    }

    if (battlePhase === "starting" || battlePhase === "playerTurnStarting") {
      setBattlePhase("playerTurn");
      // Show main menu
      setDialogue({
        isOpen: true,
        text: "What will you do?",
        choices: [
          { id: "attack", label: "Attack" },
          { id: "run", label: "Run" },
        ],
      });
    } else if (battlePhase === "playerAttacking") {
      handlePlayerAttack(move);
    } else if (battlePhase === "enemyTurnStarting") {
      handleEnemyTurn();
    } else if (battlePhase === "enemyAttacking") {
      handleEnemyAttack(move);
    } else if (battlePhase === "battleEnd") {
      endCombat();
    }
  };

  useEffect(() => {
    // Auto-advance dialogue after 2 seconds if there are no choices
    if (dialogue.isOpen && dialogue.choices.length === 0 && battlePhase !== "battleEnd") {
      const timer = setTimeout(() => {
        advanceDialogue();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [dialogue]);

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
    // Health reset removed to support persistence

    setBattlePhase("starting");

    setDialogue({
      isOpen: true,
      text: `A ${enemy.name} has appeared!`,
      choices: [],
    });
  };

  // ============================================
  // END COMBAT FUNCTION
  // ============================================

  const endCombat = (winner) => {
    // winner: "player" or "enemy"
    // Leave isActive and currentEnemy alone so we remain mounted!
    // GamePage will set combatData to null, managing the unmount cleanly
    // during the Map transition.
    setBattlePhase("waiting");
    onCombatEnd?.();
    // TODO: Give rewards if player wins, etc
  };

  // ============================================
  // HANDLE PLAYER ATTACK
  // ============================================

  const handlePlayerAttack = () => {
    if (!actionResult) return;
    setDialogue({
      isOpen: true,
      text: actionResult.hit ? `Hero hit for ${actionResult.damage} damage! ${actionResult.isCritical ? "CRITICAL!" : ""}` : `Hero missed!`,
      choices: [],
    });
    if (enemyHp <= 0) {
      setBattlePhase("battleEnd");
      setDialogue({ isOpen: true, text: `${currentEnemy.name} was defeated!`, choices: [] });
    } else {
      setBattlePhase("enemyTurnStarting");
    }
    setActionResult(null); // Clear it for the next turn
  };

  // ============================================
  // HANDLE ENEMY TURN
  // ============================================

  const handleEnemyTurn = () => {
    const enemyMove = getRandomMove(currentEnemy);
    // 1. Calculate result immediately
    const result = calculateDamage(currentEnemy, PLAYER_STATS, enemyMove);
    setActionResult(result); // Store it
    // 2. Update Player HP instantly!
    const newPlayerHp = Math.max(0, playerHp - (result.hit ? result.damage : 0));
    setPlayerHp(newPlayerHp);
    setSelectedMove(enemyMove);
    setBattlePhase("enemyAttacking");
    setDialogue({
      isOpen: true,
      text: `${currentEnemy.name} used ${enemyMove.name}!`,
      choices: [],
    });
  };

  const handleEnemyAttack = () => {
    if (!actionResult) return;
    setDialogue({
      isOpen: true,
      text: actionResult.hit
        ? `${currentEnemy.name} hit for ${actionResult.damage} damage! ${actionResult.isCritical ? "CRITICAL!" : ""}`
        : `${currentEnemy.name}'s attack missed!`,
      choices: [],
    });
    if (playerHp <= 0) {
      setBattlePhase("battleEnd");
      setDialogue({ isOpen: true, text: "You were defeated...", choices: [] });
    } else {
      setBattlePhase("playerTurnStarting");
    }
    setActionResult(null); // Clear it!
  };

  // ============================================
  // HANDLE PLAYER MOVE SELECTION
  // ============================================

  const handlePlayerMove = (moveId) => {
    if (battlePhase !== "playerTurn") return;

    const move = COMBAT_MOVES[moveId];
    if (!move) {
      return;
    }

    const result = calculateDamage(PLAYER_STATS, currentEnemy, move);
    setActionResult(result);

    const newEnemyHp = Math.max(0, enemyHp - (result.hit ? result.damage : 0));
    setEnemyHp(newEnemyHp);

    setSelectedMove(move);
    setBattlePhase("playerAttacking");

    setDialogue({
      isOpen: true,
      text: `Hero used ${move.name}!`,
      choices: [],
    });

    // Start attack animation after a short delay
  };

  if (!isActive || !currentEnemy) {
    return null; // Don't render if combat not active
  }

  return (
    <div
      className={style.container}
      onClick={advanceDialogue}
      style={{
        cursor: dialogue.isOpen && dialogue.choices.length === 0 ? "pointer" : "default",
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

      <DialogueModal dialogue={dialogue} onChoiceSelect={handleChoiceSelect} />
    </div>
  );
};

export default Combat;
