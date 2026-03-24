import { useState, useEffect, useRef, useEffectEvent, useMemo } from "react";
import GameViewport from "../GameViewport/GameViewport";
import GameUI from "../GameUI/GameUI";
import DialogueModal from "../DialogueModal/DialogueModal";
import { GRID_WIDTH, GRID_HEIGHT, CAMERA_WIDTH, CAMERA_HEIGHT, WORLD_DATA, MOVE_DURATION, NPC_DIALOGUES, toWorldKey } from "../../utils/constants";
import styles from "./Game.module.css";
import { useInventory } from "../../context/InventoryContext";

const EMPTY_DIALOGUE = {
  isOpen: false,
  npcId: null,
  nodeId: null,
  text: "",
  choices: [],
};

export default function AdventureGame({ onCombatTrigger, playerGridPos, setPlayerGridPos }) {
  const { worldLoot, feedbackMessage, openContainer } = useInventory();

  // SMOOTH MOVEMENT: Two position systems
  // playerGridPos = actual game position (for collision, logic)
  // playerDisplayPos = rendered position (smooth animation)
  const [playerDisplayPos, setPlayerDisplayPos] = useState(playerGridPos);

  const [displayCameraPos, setDisplayCameraPos] = useState({ x: 0, y: 0 });

  const [message, setMessage] = useState("Use arrow keys to move. Explore!");
  const [isMoving, setIsMoving] = useState(false);
  const [facingDir, setFacingDir] = useState({ x: 1, y: 0 });
  const [dialogue, setDialogue] = useState(EMPTY_DIALOGUE);

  const moveStartTime = useRef(0);
  const prevDisplayPos = useRef({ x: 5, y: 5 });

  // ============================================
  // SMOOTH MOVEMENT ANIMATION LOOP
  // ============================================

  useEffect(() => {
    // Only run the animation loop when actually moving
    if (!isMoving) return;

    let animationId;

    const animate = () => {
      const elapsed = Date.now() - moveStartTime.current;
      const progress = Math.min(elapsed / MOVE_DURATION, 1);

      // Apply easing function (ease-out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      // Interpolate between old and new position
      const newX = prevDisplayPos.current.x + (playerGridPos.x - prevDisplayPos.current.x) * easeProgress;
      const newY = prevDisplayPos.current.y + (playerGridPos.y - prevDisplayPos.current.y) * easeProgress;

      setPlayerDisplayPos({ x: newX, y: newY });

      // Animation finished?
      if (progress >= 1) {
        setPlayerDisplayPos(playerGridPos);
        setIsMoving(false);
        return; // stop the loop
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isMoving, playerGridPos, facingDir]);

  // ============================================
  // COLLISION DETECTION
  // ============================================

  const canMoveTo = (x, y) => {
    // Out of bounds?
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
    // Solid object there?
    if (WORLD_DATA.objects[y]?.[x] !== 0) return false;
    return true;
  };

  // Check what tile is at position x, y
  const getTileAt = (x, y, tileType = "objects") => {
    return WORLD_DATA[tileType][y]?.[x] || 0;
  };

  const getNpcDialogueNode = (npcId, nodeId = "start") => {
    return NPC_DIALOGUES[npcId]?.[nodeId] || null;
  };

  const createDialogueState = (npcId, nodeId) => {
    const dialogueNode = getNpcDialogueNode(npcId, nodeId);

    if (!dialogueNode) {
      return {
        ...EMPTY_DIALOGUE,
        isOpen: true,
        npcId,
        nodeId,
        text: "Hello traveler. Stay safe out there.",
      };
    }

    return {
      isOpen: true,
      npcId,
      nodeId,
      text: dialogueNode.text,
      choices: dialogueNode.choices || [],
    };
  };

  const closeDialogue = () => {
    setDialogue(EMPTY_DIALOGUE);
    setMessage("Conversation ended.");
  };

  const handleChoiceSelect = (choiceId) => {
    if (choiceId === "leave") {
      closeDialogue();
      return;
    }

    if (!dialogue.npcId) {
      return;
    }

    const nextDialogueNode = getNpcDialogueNode(dialogue.npcId, choiceId);

    if (!nextDialogueNode) {
      setMessage("That option is not available right now.");
      return;
    }

    setDialogue(createDialogueState(dialogue.npcId, choiceId));
    setMessage("Talking...");
  };

  const getNearbyNpc = () => {
    const candidateOffsets = [facingDir, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];

    for (const offset of candidateOffsets) {
      const targetX = playerGridPos.x + offset.x;
      const targetY = playerGridPos.y + offset.y;

      if (getTileAt(targetX, targetY, "objects") === "npc" || getTileAt(targetX, targetY, "interactive") === 2) {
        return {
          npcId: `${targetX},${targetY}`,
          x: targetX,
          y: targetY,
        };
      }
    }

    return null;
  };

  // ============================================
  // CAMERA SYSTEM - FOLLOWS GRID POSITION
  // ============================================

  const cameraCenterX = CAMERA_WIDTH / 2;
  const cameraCenterY = CAMERA_HEIGHT / 2;
  const cameraPos = useMemo(
    () => ({
      x: Math.max(0, Math.min(Math.floor(playerGridPos.x) - cameraCenterX, GRID_WIDTH - CAMERA_WIDTH)),
      y: Math.max(0, Math.min(Math.floor(playerGridPos.y) - cameraCenterY, GRID_HEIGHT - CAMERA_HEIGHT)),
    }),
    [playerGridPos.x, playerGridPos.y, cameraCenterX, cameraCenterY],
  );

  // smooth camera
  useEffect(() => {
    let animationId;
    const cameraSpeed = 0.1; // Adjust between 0.05 (slower) to 0.2 (faster)
    const SNAP_THRESHOLD = 0.01;

    const animateCamera = () => {
      setDisplayCameraPos((prev) => {
        const dx = cameraPos.x - prev.x;
        const dy = cameraPos.y - prev.y;

        // Snap to target when close enough to avoid endless micro-updates.
        // Must return `prev` (same reference) so React bails out and does NOT re-render.
        if (Math.abs(dx) < SNAP_THRESHOLD && Math.abs(dy) < SNAP_THRESHOLD) {
          return prev;
        }

        return {
          x: prev.x + dx * cameraSpeed,
          y: prev.y + dy * cameraSpeed,
        };
      });

      animationId = requestAnimationFrame(animateCamera);
    };

    animationId = requestAnimationFrame(animateCamera);
    return () => cancelAnimationFrame(animationId);
  }, [cameraPos]);

  // ============================================
  // MOVEMENT HANDLER
  // ============================================

  function handleMove(dx, dy) {
    if (dialogue.isOpen) return;

    // Update facing direction
    setFacingDir({ x: dx, y: dy });

    // Don't move if already moving (COOLDOWN)
    if (isMoving) return;

    const newX = playerGridPos.x + dx;
    const newY = playerGridPos.y + dy;

    // Check collision
    if (!canMoveTo(newX, newY)) {
      setMessage("🚫 Blocked by an obstacle!");
      setTimeout(() => setMessage(""), 1000);
      return;
    }

    // Move is valid
    prevDisplayPos.current = playerDisplayPos;
    setPlayerGridPos({ x: newX, y: newY });
    setIsMoving(true);
    moveStartTime.current = Date.now();

    // ============================================
    // CHECK FOR RANDOM ENCOUNTER
    // ============================================

    // Check for interactive tiles
    const interactive = getTileAt(newX, newY, "interactive");
    if (interactive === 3) {
      // NEW: Encounter tile (invisible)
      const ENCOUNTER_CHANCE = 15;
      if (Math.random() * 100 < ENCOUNTER_CHANCE) {
        // Biome-based enemy selection
        let enemyId = "goblin"; // Default
        onCombatTrigger?.(enemyId);
        return; // Exit early so we don't keep moving
      }

      setMessage("");
    }
  }
  // ============================================
  // ACTION HANDLER
  // ============================================

  function handleAction() {
    if (dialogue.isOpen) {
      if (dialogue.choices.length === 0) {
        closeDialogue();
      }

      return;
    }

    const nearbyNpc = getNearbyNpc();

    if (nearbyNpc) {
      setDialogue(createDialogueState(nearbyNpc.npcId, "start"));
      setMessage("Talking...");
      return;
    }

    const targetX = playerGridPos.x + facingDir.x;
    const targetY = playerGridPos.y + facingDir.y;
    const targetLoot = worldLoot[toWorldKey(targetX, targetY)];

    if (targetLoot?.kind === "chest") {
      const openResult = openContainer(toWorldKey(targetX, targetY));
      setMessage(openResult.message);
      return;
    }

    const objectAtTarget = getTileAt(targetX, targetY);

    if (objectAtTarget !== 0) {
      setMessage(`Can't go this way, it's blocked by a ${objectAtTarget}!`);
      return;
    }

    const interactiveAtTarget = getTileAt(targetX, targetY, "interactive");

    if (interactiveAtTarget === 1) {
      setMessage("There is a chest here, but it cannot be opened right now.");
    }
  }

  // ============================================
  // KEYBOARD INPUT
  // ============================================

  const handleKeyDown = useEffectEvent((e) => {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      handleMove(0, -1);
      e.preventDefault();
    }
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      handleMove(0, 1);
      e.preventDefault();
    }
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      handleMove(-1, 0);
      e.preventDefault();
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      handleMove(1, 0);
      e.preventDefault();
    }
    if (e.key === "Enter") {
      handleAction();
      e.preventDefault();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={styles.container}>
      <GameUI
        playerGridPos={playerGridPos}
        playerDisplayPos={playerDisplayPos}
        message={feedbackMessage || message}
        gridWidth={GRID_WIDTH}
        gridHeight={GRID_HEIGHT}
        facingDir={facingDir}
      />
      <DialogueModal dialogue={dialogue} onChoiceSelect={handleChoiceSelect} />
      <GameViewport playerDisplayPos={playerDisplayPos} cameraPos={displayCameraPos} facingDir={facingDir} />
    </div>
  );
}
