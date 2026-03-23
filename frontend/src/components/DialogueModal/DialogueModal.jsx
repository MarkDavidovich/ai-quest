import { useEffect, useState } from "react";
import styles from "./DialogueModal.module.css";

const DialogueModal = ({ dialogue, onChoiceSelect }) => {
  const [typedDialogue, setTypedDialogue] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!dialogue.isOpen) {
      setTypedDialogue("");
      setShowCursor(false);
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    setTypedDialogue("");
    setShowCursor(true);
    setIsTyping(true);
    // #region agent log
    fetch("http://127.0.0.1:7836/ingest/4fd98840-c421-4728-8c15-d4f256c7de6d", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "53b88a" },
      body: JSON.stringify({
        sessionId: "53b88a",
        runId: "npc-dialogue-debug",
        hypothesisId: "H2_H3",
        location: "DialogueModal.jsx:21",
        message: "DialogueModal opened dialogue",
        data: {
          npcId: dialogue.npcId,
          nodeId: dialogue.nodeId,
          choicesCount: dialogue.choices?.length ?? 0,
          textLength: dialogue.text?.length ?? 0,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const typingInterval = window.setInterval(() => {
      currentIndex += 1;
      setTypedDialogue(dialogue.text.slice(0, currentIndex));

      if (currentIndex >= dialogue.text.length) {
        window.clearInterval(typingInterval);
        setShowCursor(false);
        setIsTyping(false);
        // #region agent log
        fetch("http://127.0.0.1:7836/ingest/4fd98840-c421-4728-8c15-d4f256c7de6d", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "53b88a" },
          body: JSON.stringify({
            sessionId: "53b88a",
            runId: "npc-dialogue-debug",
            hypothesisId: "H3",
            location: "DialogueModal.jsx:40",
            message: "DialogueModal finished typing",
            data: {
              npcId: dialogue.npcId,
              nodeId: dialogue.nodeId,
              choicesCount: dialogue.choices?.length ?? 0,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
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
      {dialogue.choices.length > 0 && (
        <div>
          {dialogue.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => {
                // #region agent log
                fetch("http://127.0.0.1:7836/ingest/4fd98840-c421-4728-8c15-d4f256c7de6d", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "53b88a" },
                  body: JSON.stringify({
                    sessionId: "53b88a",
                    runId: "npc-dialogue-debug",
                    hypothesisId: "H4",
                    location: "DialogueModal.jsx:63",
                    message: "DialogueModal choice button clicked",
                    data: {
                      npcId: dialogue.npcId,
                      nodeId: dialogue.nodeId,
                      choiceId: choice.id,
                      isTyping,
                    },
                    timestamp: Date.now(),
                  }),
                }).catch(() => {});
                // #endregion
                onChoiceSelect(choice.id);
              }}
              disabled={isTyping}
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}
      <p className={styles.dialogueHint}>
        {dialogue.choices.length > 0 ? "Choose an option" : "Press Enter again to close"}
      </p>
    </div>
  );
};

export default DialogueModal;