import { useEffect, useState } from "react";
import styles from "./GameUI.module.css";

const GameUI = ({ playerGridPos, playerDisplayPos, message, gridWidth, gridHeight, facingDir, dialogue }) => {
  const [typedDialogue, setTypedDialogue] = useState("");

  useEffect(() => {
    if (!dialogue.isOpen) {
      setTypedDialogue("");
      return;
    }

    let currentIndex = 0;
    setTypedDialogue("");

    const typingInterval = window.setInterval(() => {
      currentIndex += 1;
      setTypedDialogue(dialogue.text.slice(0, currentIndex));

      if (currentIndex >= dialogue.text.length) {
        window.clearInterval(typingInterval);
      }
    }, 28);

    return () => window.clearInterval(typingInterval);
  }, [dialogue.isOpen, dialogue.text]);

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
          <p className={styles.dialogueText}>
            {typedDialogue}
            <span className={styles.dialogueCursor} aria-hidden="true"></span>
          </p>
          <p className={styles.dialogueHint}>Press Enter again to close</p>
        </div>
      )}
    </>
  );
};

export default GameUI;
