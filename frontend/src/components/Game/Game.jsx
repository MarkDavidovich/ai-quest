import { useState, useEffect, useRef, useEffectEvent, useMemo } from "react";
import GameViewport from "../GameViewport/GameViewport";
import GameUI from "../GameUI/GameUI";
import DialogueModal from "../DialogueModal/DialogueModal";
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  CAMERA_WIDTH,
  CAMERA_HEIGHT,
  MAPS,
  TELEPORTS,
  MOVE_DURATION,
  NPC_DIALOGUES,
  NPC_NAMES,
  NPC_OBJECT_TYPES,
  toWorldKey,
  EMPTY_DIALOGUE,
} from "../../utils/constants";
import styles from "./Game.module.css";
import { useInventory } from "../../context/InventoryContext";
import { fetchAiDialogue } from "../../services/npcDialogueApi";
import { useQuest } from "../../context/QuestContext";

export default function AdventureGame({ onCombatTrigger, playerGridPos, setPlayerGridPos, currentMapId, setCurrentMapId, triggerTransition, isTransitioning }) {
  const { worldLoot, feedbackMessage, openContainer, hasItem, removeItem } = useInventory();
  const { getQuestStep, advanceQuest } = useQuest();

  const currentMapData = useMemo(() => MAPS[currentMapId], [currentMapId]);

  const [playerDisplayPos, setPlayerDisplayPos] = useState(playerGridPos);
  const [displayCameraPos, setDisplayCameraPos] = useState({ x: 0, y: 0 });

  const [message, setMessage] = useState("Use arrow keys to move. Explore!");
  const [isMoving, setIsMoving] = useState(false);
  const [facingDir, setFacingDir] = useState({ x: 1, y: 0 });
  const [dialogue, setDialogue] = useState(EMPTY_DIALOGUE);
  const [npcMemories, setNpcMemories] = useState({});

  const moveStartTime = useRef(0);
  const prevDisplayPos = useRef({ x: 5, y: 5 });
  const mapReturnOverrides = useRef({});

  useEffect(() => {
    if (!isMoving) return;

    let animationId;

    const animate = () => {
      const elapsed = Date.now() - moveStartTime.current;
      const progress = Math.min(elapsed / MOVE_DURATION, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const newX = prevDisplayPos.current.x + (playerGridPos.x - prevDisplayPos.current.x) * easeProgress;
      const newY = prevDisplayPos.current.y + (playerGridPos.y - prevDisplayPos.current.y) * easeProgress;

      setPlayerDisplayPos({ x: newX, y: newY });

      if (progress >= 1) {
        setPlayerDisplayPos(playerGridPos);
        setIsMoving(false);
        return;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isMoving, playerGridPos, facingDir]);

  const canMoveTo = (x, y) => {
    if (x < 0 || x >= currentMapData.width || y < 0 || y >= currentMapData.height) return false;
    if (currentMapData.objects[y]?.[x] !== 0) return false;
    return true;
  };

  const getTileAt = (x, y, tileType = "objects") => {
    return currentMapData[tileType][y]?.[x] || 0;
  };

  const getNpcDialogueNode = (npcId, nodeId = "start") => {
    return NPC_DIALOGUES[npcId]?.[nodeId] || null;
  };

  const getNpcCaller = (npcId) => {
    return NPC_NAMES[npcId] || "Villager";
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
      caller: getNpcCaller(npcId),
    };
  };

  const closeDialogue = () => {
    setDialogue(EMPTY_DIALOGUE);
    setMessage("Conversation ended.");
  };

  // ============================================
  // הפונקציה הזו בודקת אם יש לשחקן קווסט פעיל מה-NPC הספציפי ואם יש לו את החפצים
  // ============================================
  const buildQuestContext = (npcId) => {
    const quest = getQuestStep(`ai_quest_${npcId}`);
    if (!quest || quest === "unstarted" || quest.status !== "active") return "";

    const playerHasItems = hasItem(quest.targetId, quest.amount);

    if (playerHasItems) {
      return `The player is currently on your quest to gather ${quest.amount} ${quest.targetId}(s). GOOD NEWS: They HAVE collected the required items! You MUST thank them, tell them the quest is complete, and set "questCompleted": true in your JSON response.`;
    } else {
      return `The player is currently on your quest to gather ${quest.amount} ${quest.targetId}(s). BAD NEWS: They DO NOT have the required items yet. Remind them what they need to do. Do NOT set questCompleted to true.`;
    }
  };

  const handleChoiceSelect = async (choiceId) => {
    if (choiceId === "leave") {
      closeDialogue();
      return;
    }

    // ============================================
    // טיפול בתשובות של קווסט המדריך (Tutorial Quest)
    // ============================================
    if (dialogue.source === "tutorial_quest") {
      if (choiceId === "quest_accept") {
        advanceQuest("tutorial", "accepted");
        setDialogue({
          isOpen: true,
          npcId: "tutorial_npc",
          text: 'Great! Pick something from the box inside the home. Just be close to the box and press "Enter".',
          choices: [{ id: "leave", label: "I will do that" }],
          source: "tutorial_quest",
          caller: getNpcCaller("tutorial_npc"),
        });
      } else if (choiceId === "quest_decline") {
        setDialogue({
          isOpen: true,
          npcId: "tutorial_npc",
          text: "I see. Let me know if you change your mind later.",
          choices: [{ id: "leave", label: "Goodbye" }],
          source: "tutorial_quest",
          caller: getNpcCaller("tutorial_npc"),
        });
      } else if (choiceId === "quest_give_potion") {
        removeItem("potion", 1);
        advanceQuest("tutorial", "completed");
        setDialogue({
          isOpen: true,
          npcId: "tutorial_npc",
          text: "Thank you! I will pack this. We are ready, you can go out from the house now.",
          choices: [{ id: "leave", label: "Exit House" }],
          source: "tutorial_quest",
          caller: getNpcCaller("tutorial_npc"),
        });
      }
      return;
    }

    if (!dialogue.npcId) {
      return;
    }

    if (dialogue.source !== "ai") {
      const nextDialogueNode = getNpcDialogueNode(dialogue.npcId, choiceId);

      if (!nextDialogueNode) {
        setMessage("That option is not available right now.");
        return;
      }

      setDialogue(createDialogueState(dialogue.npcId, choiceId));
      setMessage("Talking...");
      return;
    }

    /* AI route */
    const selectedChoice = dialogue.choices.find((c) => c.id === choiceId);
    const playerText = selectedChoice ? selectedChoice.label : "";

    const pastHistory = npcMemories[dialogue.npcId] || [];
    const updatedHistory = [...pastHistory, { source: "player", text: playerText }];

    setDialogue((prev) => ({
      ...prev,
      isLoading: true,
      text: "Thinking...",
      choices: [],
    }));

    try {
      // === עדכנו את הקריאה פה ===
      const aiData = await fetchAiDialogue(dialogue.npcId, playerText, updatedHistory, buildQuestContext(dialogue.npcId));
      const newHistory = [...updatedHistory, { source: "ai", text: aiData.text }];

      // ============================================
      // קליטת הקווסט מה-AI ושמירתו ב-Context
      // ============================================
      if (aiData.questOffer) {
        advanceQuest(`ai_quest_${dialogue.npcId}`, {
          ...aiData.questOffer,
          status: "active",
        });
        setMessage(`New Quest Received: ${aiData.questOffer.type} ${aiData.questOffer.amount} ${aiData.questOffer.targetId}(s)!`);
      }

      // === תוספת השלמת הקווסט ===
      if (aiData.questCompleted) {
        const quest = getQuestStep(`ai_quest_${dialogue.npcId}`);
        if (quest && quest.status === "active") {
          removeItem(quest.targetId, quest.amount); // לוקחים לשחקן את החפצים
          advanceQuest(`ai_quest_${dialogue.npcId}`, { ...quest, status: "completed" });
          setMessage(`Quest Completed! Handed over ${quest.amount} ${quest.targetId}(s).`);
        }
      }

      setDialogue({
        isOpen: true,
        npcId: dialogue.npcId,
        nodeId: aiData.nodeId,
        text: aiData.text,
        choices: aiData.choices,
        isLoading: false,
        source: "ai",
        history: newHistory,
        caller: getNpcCaller(dialogue.npcId),
      });

      setNpcMemories((prev) => ({ ...prev, [dialogue.npcId]: newHistory }));
    } catch (error) {
      setDialogue({
        isOpen: true,
        npcId: dialogue.npcId,
        text: "*The NPC seems distracted and ignores you.*",
        choices: [{ id: "leave", label: "(Leave)" }],
        isLoading: false,
        source: "static",
      });
    }
  };

  const getNearbyNpc = () => {
    const candidateOffsets = [facingDir, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];

    for (const offset of candidateOffsets) {
      const targetX = playerGridPos.x + offset.x;
      const targetY = playerGridPos.y + offset.y;
      const objectType = getTileAt(targetX, targetY, "objects");

      if (NPC_OBJECT_TYPES.includes(objectType) || getTileAt(targetX, targetY, "interactive") === 2) {
        const npcId = currentMapId === "forest" ? `${targetX},${targetY}` : `${currentMapId}:${targetX},${targetY}`;
        return {
          npcId,
          x: targetX,
          y: targetY,
        };
      }
    }

    return null;
  };

  const cameraCenterX = CAMERA_WIDTH / 2;
  const cameraCenterY = CAMERA_HEIGHT / 2;
  const cameraPos = useMemo(
    () => ({
      x: Math.max(0, Math.min(Math.floor(playerGridPos.x) - cameraCenterX, currentMapData.width - CAMERA_WIDTH)),
      y: Math.max(0, Math.min(Math.floor(playerGridPos.y) - cameraCenterY, currentMapData.height - CAMERA_HEIGHT)),
    }),
    [playerGridPos.x, playerGridPos.y, cameraCenterX, cameraCenterY, currentMapData.width, currentMapData.height],
  );

  useEffect(() => {
    let animationId;
    const cameraSpeed = 0.1;
    const SNAP_THRESHOLD = 0.01;

    const animateCamera = () => {
      setDisplayCameraPos((prev) => {
        const dx = cameraPos.x - prev.x;
        const dy = cameraPos.y - prev.y;

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

  function handleMove(dx, dy) {
    if (dialogue.isOpen || isTransitioning) return;

    setFacingDir({ x: dx, y: dy });

    if (isMoving) return;

    const newX = playerGridPos.x + dx;
    const newY = playerGridPos.y + dy;
    const interactive = getTileAt(newX, newY, "interactive");

    if (interactive === 4) {
      const teleportData = TELEPORTS[currentMapId]?.[toWorldKey(newX, newY)];
      if (teleportData) {
        // if (currentMapId === "playerHouse" && getQuestStep("tutorial") !== "completed") {
        //   setDialogue({
        //     isOpen: true,
        //     npcId: dialogue.npcId,
        //     text: "Hey! where are you going? give me that potion!",
        //     choices: [],
        //   });
        //   return;
        // }

        const returnOverride = mapReturnOverrides.current[currentMapId];
        const resolvedTeleport = returnOverride && teleportData.targetMap === "forest" ? returnOverride : teleportData;
        const { targetMap, targetX, targetY, returnMap, returnX, returnY } = resolvedTeleport;

        triggerTransition?.("map", () => {
          if (returnMap && returnX !== undefined && returnY !== undefined) {
            mapReturnOverrides.current[targetMap] = {
              targetMap: returnMap,
              targetX: returnX,
              targetY: returnY,
            };
          }
          setCurrentMapId(targetMap);
          setPlayerGridPos({ x: targetX, y: targetY });
          setPlayerDisplayPos({ x: targetX, y: targetY });
          setIsMoving(false);
        });
        return;
      }
    }

    if (!canMoveTo(newX, newY)) {
      setMessage("🚫 Blocked by an obstacle!");
      setTimeout(() => setMessage(""), 1000);
      return;
    }

    prevDisplayPos.current = playerDisplayPos;
    setPlayerGridPos({ x: newX, y: newY });
    setIsMoving(true);
    moveStartTime.current = Date.now();

    if (interactive === 3) {
      const ENCOUNTER_CHANCE = 15;
      if (Math.random() * 100 < ENCOUNTER_CHANCE) {
        let enemyId = "goblin";

        triggerTransition?.("battle", () => {
          onCombatTrigger?.(enemyId);
        });
        return;
      }

      setMessage("");
    }
  }

  async function handleAction() {
    if (dialogue.isOpen) {
      if (dialogue.isLoading) return;
      if (dialogue.choices.length === 0) {
        closeDialogue();
      }
      return;
    }

    const nearbyNpc = getNearbyNpc();

    if (nearbyNpc) {
      if (currentMapId === "playerHouse" && nearbyNpc.x === 6 && nearbyNpc.y === 4) {
        const step = getQuestStep("tutorial");

        if (step === "unstarted") {
          setDialogue({
            isOpen: true,
            npcId: "tutorial_npc",
            text: "The king sent me to you, the people of Negev Talent kingdom need your help, the evil wizard Nir and his TA Adi are going to destorying the kingdom, go to the desert",
            choices: [
              { id: "quest_accept", label: "Yes, let's go" },
              { id: "quest_decline", label: "No, later" },
            ],
            source: "tutorial_quest",
            caller: getNpcCaller("tutorial_npc"),
          });
        } else if (step === "accepted") {
          if (hasItem("potion", 1)) {
            setDialogue({
              isOpen: true,
              npcId: "tutorial_npc",
              text: "Ah, you found the potion! Hand it over to me, and then we can leave.",
              choices: [
                { id: "quest_give_potion", label: "Here you go" },
                { id: "leave", label: "Not yet" },
              ],
              source: "tutorial_quest",
              caller: getNpcCaller("tutorial_npc"),
            });
          } else {
            setDialogue({
              isOpen: true,
              npcId: "tutorial_npc",
              text: 'The journey ahead of you is long and you need all the help you can get, Please pick up the potion from the box inside the home. Just stand close to it and press "Enter".',
              choices: [{ id: "leave", label: "Got it" }],
              source: "tutorial_quest",
              caller: getNpcCaller("tutorial_npc"),
            });
          }
        } else if (step === "completed") {
          setDialogue({
            isOpen: true,
            npcId: "tutorial_npc",
            text: "We are all set. You can go out from the house whenever you are ready.",
            choices: [{ id: "leave", label: "Let's go" }],
            source: "tutorial_quest",
            caller: getNpcCaller("tutorial_npc"),
          });
        }
        return;
      }

      setMessage("Talking...");

      const pastHistory = npcMemories[nearbyNpc.npcId] || [];

      setDialogue({
        isOpen: true,
        npcId: nearbyNpc.npcId,
        nodeId: "start",
        text: "...",
        choices: [],
        isLoading: true,
        source: "ai",
        history: pastHistory,
        caller: getNpcCaller(nearbyNpc.npcId),
      });

      try {
        // === עדכנו את הקריאה פה ===
        const aiData = await fetchAiDialogue(nearbyNpc.npcId, "Hello", pastHistory, buildQuestContext(nearbyNpc.npcId));
        const newHistory = [...pastHistory, { source: "ai", text: aiData.text }];

        // ============================================
        // קליטת הקווסט מה-AI (גם בשיחה הראשונית)
        // ============================================
        if (aiData.questOffer) {
          advanceQuest(`ai_quest_${nearbyNpc.npcId}`, {
            ...aiData.questOffer,
            status: "active",
          });
          setMessage(`New Quest Received: ${aiData.questOffer.type} ${aiData.questOffer.amount} ${aiData.questOffer.targetId}(s)!`);
        }

        // === תוספת השלמת הקווסט ===
        if (aiData.questCompleted) {
          const quest = getQuestStep(`ai_quest_${nearbyNpc.npcId}`);
          if (quest && quest.status === "active") {
            removeItem(quest.targetId, quest.amount); // לוקחים לשחקן את החפצים
            advanceQuest(`ai_quest_${nearbyNpc.npcId}`, { ...quest, status: "completed" });
          }
        }

        setDialogue({
          isOpen: true,
          npcId: nearbyNpc.npcId,
          nodeId: aiData.nodeId,
          text: aiData.text,
          choices: aiData.choices,
          isLoading: false,
          source: "ai",
          history: newHistory,
          caller: getNpcCaller(nearbyNpc.npcId),
        });

        setNpcMemories((prev) => ({ ...prev, [nearbyNpc.npcId]: newHistory }));
      } catch (error) {
        console.warn("Falling back to static dialogue");
        setDialogue({
          ...createDialogueState(nearbyNpc.npcId, "start"),
          source: "static",
        });
      }
      return;
    }

    const targetX = playerGridPos.x + facingDir.x;
    const targetY = playerGridPos.y + facingDir.y;
    const targetLoot = worldLoot[toWorldKey(targetX, targetY)];

    if (targetLoot?.kind === "chest") {
      const openResult = openContainer(toWorldKey(targetX, targetY));
      setMessage(openResult.message);
      setDialogue({
        isOpen: true,
        text: openResult.message,
        choices: [],
      });
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
        message={message}
        gridWidth={currentMapData.width}
        gridHeight={currentMapData.height}
        facingDir={facingDir}
        currentMapId={currentMapId}
      />
      <DialogueModal dialogue={dialogue} onChoiceSelect={handleChoiceSelect} />
      <GameViewport
        playerDisplayPos={playerDisplayPos}
        cameraPos={displayCameraPos}
        facingDir={facingDir}
        currentMapData={currentMapData}
        worldLoot={worldLoot}
        isMoving={isMoving}
      />
    </div>
  );
}
