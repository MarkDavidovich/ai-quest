import styles from "./GameUI.module.css";

const GameUI = ({ playerGridPos, playerDisplayPos, message, gridWidth, gridHeight, facingDir, dialogue }) => {
  return (
    <>
      <div className={styles.statusDisplay}>
        <p className={styles.statusText}>
          <strong>Grid Position:</strong> ({playerGridPos.x}, {playerGridPos.y}) | <strong style={{ marginLeft: "12px" }}>Display Position:</strong> (
          {playerDisplayPos.x.toFixed(2)}, {playerDisplayPos.y.toFixed(2)}) | <strong style={{ marginLeft: "12px" }}>World:</strong> {gridWidth}×{gridHeight}{" "}
          tiles
        </p>
        <p>{`Facing direction: x:${facingDir.x}, y:${facingDir.y}`}</p>
        <p className={styles.message}>{message}</p>
      </div>
      {dialogue.isOpen && (
        <div className={styles.dialogueModal}>
          <p className={styles.dialogueLabel}>NPC</p>
          <p className={styles.dialogueText}>{dialogue.text}</p>
          <p className={styles.dialogueHint}>Press Enter again to close</p>
        </div>
      )}
    </>
  );
};

export default GameUI;
