import { useEffect, useState } from "react";
import styles from "./DialogueModal.module.css";

const DialogueModal = ({ dialogue }) => {
  const [typedDialogue, setTypedDialogue] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (!dialogue.isOpen) {
      setTypedDialogue("");
      setShowCursor(false);
      return;
    }

    let currentIndex = 0;
    setTypedDialogue("");
    setShowCursor(true);

    const typingInterval = window.setInterval(() => {
      currentIndex += 1;
      setTypedDialogue(dialogue.text.slice(0, currentIndex));

      if (currentIndex >= dialogue.text.length) {
        window.clearInterval(typingInterval);
        setShowCursor(false);
      }
    }, 28);

    return () => window.clearInterval(typingInterval);
  }, [dialogue.isOpen, dialogue.text]);

  if (!dialogue.isOpen) return null;

  return (
    <div className={styles.dialogueModal}>
      <p className={styles.dialogueLabel}>NPC</p>
      <p className={styles.dialogueText}>
        {typedDialogue}
        {showCursor && <span className={styles.dialogueCursor} aria-hidden="true"></span>}
      </p>
      <p className={styles.dialogueHint}>Press Enter again to close</p>
    </div>
  );
};

export default DialogueModal;
