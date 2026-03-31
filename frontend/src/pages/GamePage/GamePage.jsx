import style from "./GamePage.module.css";
import Game from "../../components/Game/Game";
import Combat from "../../components/Combat/Combat";
import Header from "../../components/Header/Header";
import TransitionOverlay from "../../components/TransitionOverlay/TransitionOverlay";
import { CAMERA_HEIGHT, CAMERA_WIDTH, UNIT_SIZE, PLAYER_STATS, ITEM_DEFINITIONS } from "../../utils/constants";
import { InventoryProvider } from "../../context/InventoryContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { saveGameToBackend } from "../../services/gameApi";
import { useLocation, useNavigate } from "react-router-dom";
import { QuestProvider } from "../../context/QuestContext";
import TouchControls from "../../components/TouchControls/TouchControls";
import DialogueModal from "../../components/DialogueModal/DialogueModal";

const PAGE_GUTTER_DESKTOP = 20;
const PAGE_GUTTER_MOBILE = 8;

const getViewportMetrics = () => ({
  width: window.visualViewport?.width ?? window.innerWidth,
  height: window.visualViewport?.height ?? window.innerHeight,
});

const getTouchCapability = () => window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loadedData = location.state?.loadSave;
  const initialQuestProgress = loadedData?.session?.quest_progress || {};
  const headerShellRef = useRef(null);
  const [combatData, setCombatData] = useState(null);
  const [playerGridPos, setPlayerGridPos] = useState(loadedData ? { x: loadedData.profile.position_x, y: loadedData.profile.position_y } : { x: 4, y: 2 });
  const [playerDisplayPos, setPlayerDisplayPos] = useState(playerGridPos);
  const [currentMapId, setCurrentMapId] = useState(loadedData ? loadedData.session.current_map : "playerHouse");
  const [playerHp, setPlayerHp] = useState(loadedData ? loadedData.profile.hp : PLAYER_STATS.maxHp);
  const [transition, setTransition] = useState({ step: "closed", type: "map" });
  const [viewport, setViewport] = useState(() => getViewportMetrics());
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(() => getTouchCapability());
  const [saveDialogue, setSaveDialogue] = useState({ isOpen: false, text: "", caller: "System", choices: [] });

  const closeSaveDialogue = () => setSaveDialogue((prev) => ({ ...prev, isOpen: false }));

  const handleSaveGame = async (inventoryItems) => {
    try {
      const gameState = {
        profile: {
          hp: playerHp,
          max_hp: PLAYER_STATS.maxHp,
          attack: PLAYER_STATS.attack,
          defense: PLAYER_STATS.defense,
          position_x: playerGridPos.x,
          position_y: playerGridPos.y,
          level: 1,
        },
        session: {
          current_map: currentMapId,
          status: combatData ? "in_combat" : "playing",
        },
        inventory: inventoryItems,
      };
      await saveGameToBackend(gameState);
      setSaveDialogue({
        isOpen: true,
        text: "Game Saved Successfully!",
        caller: "System",
        choices: [],
      });
      setTimeout(() => closeSaveDialogue(), 2000);
    } catch (error) {
      console.error("Failed to save game:", error);
      setSaveDialogue({
        isOpen: true,
        text: "Error saving game. Please try again.",
        caller: "System",
        choices: [],
      });
      setTimeout(() => closeSaveDialogue(), 3000);
    }
  };

  const handleItemUse = (itemId) => {
    if (itemId === "potion") {
      // Heal 50 HP, but don't exceed max
      setPlayerHp((prev) => Math.min(PLAYER_STATS.maxHp, prev + 50));
    }

    if (itemId === "recall_scroll") {
      const itemDef = ITEM_DEFINITIONS[itemId];

      triggerTransition("map", () => {
        setCurrentMapId(itemDef.targetMap);
        setPlayerGridPos({ x: itemDef.targetX, y: itemDef.targetY });
        setPlayerDisplayPos({ x: itemDef.targetX, y: itemDef.targetY });
      });

      setSaveDialogue({
        isOpen: true,
        text: "You used a Recall Scroll and returned home!",
        caller: "System",
        choices: [],
      });

      setTimeout(() => closeSaveDialogue(), 2000);
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

  const handlePlayerDeath = () => {
    navigate("/");
  };

  const gameWidth = `${CAMERA_WIDTH * UNIT_SIZE}px`;
  const gameHeight = `${CAMERA_HEIGHT * UNIT_SIZE}px`;
  const logicalGameWidth = CAMERA_WIDTH * UNIT_SIZE;
  const logicalGameHeight = CAMERA_HEIGHT * UNIT_SIZE;
  const isLandscape = viewport.width >= viewport.height;
  const isMobileViewport = viewport.width <= 900;
  const useCompactHeader = isTouchDevice;
  const shouldShowLandscapePrompt = useCompactHeader && !isLandscape;
  const shouldBiasStageRight = useCompactHeader && isLandscape;
  const shouldShowTouchControls = useCompactHeader && isLandscape && !combatData;
  const pageGutter = isMobileViewport ? PAGE_GUTTER_MOBILE : PAGE_GUTTER_DESKTOP;

  useEffect(() => {
    const updateViewport = () => {
      setViewport(getViewportMetrics());
      setIsTouchDevice(getTouchCapability());
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!saveDialogue.isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === "Escape") {
        closeSaveDialogue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveDialogue.isOpen]);

  useEffect(() => {
    if (useCompactHeader) {
      setHeaderHeight(0);
      return undefined;
    }

    if (!headerShellRef.current || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const updateHeaderHeight = () => {
      if (!headerShellRef.current) {
        return;
      }

      setHeaderHeight(headerShellRef.current.getBoundingClientRect().height);
    };

    updateHeaderHeight();

    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(headerShellRef.current);

    return () => observer.disconnect();
  }, [useCompactHeader]);

  const scaledStage = useMemo(() => {
    const availableWidth = Math.max(viewport.width - pageGutter * 2, 1);
    const reservedHeight = (useCompactHeader ? 0 : headerHeight) + pageGutter * 2 + (shouldShowLandscapePrompt ? 180 : 0);
    const availableHeight = Math.max(viewport.height - reservedHeight, 1);
    const scale = Math.min(1, availableWidth / logicalGameWidth, availableHeight / logicalGameHeight);

    return {
      scale,
      width: Math.max(1, Math.floor(logicalGameWidth * scale)),
      height: Math.max(1, Math.floor(logicalGameHeight * scale)),
    };
  }, [headerHeight, logicalGameHeight, logicalGameWidth, pageGutter, shouldShowLandscapePrompt, useCompactHeader, viewport.height, viewport.width]);

  const mobileStageOffsetX = useMemo(() => {
    if (!shouldBiasStageRight) {
      return 0;
    }

    const spareHorizontalSpace = Math.max(0, viewport.width - scaledStage.width);
    const extraRightBias = Math.min(220, viewport.width * 0.22);
    return Math.max(0, spareHorizontalSpace + extraRightBias);
  }, [scaledStage.width, shouldBiasStageRight, viewport.width]);

  return (
    <QuestProvider initialQuestProgress={initialQuestProgress}>
      <InventoryProvider initialItems={loadedData ? loadedData.inventory : []}>
        <div
          className={style.container}
          style={{
            "--game-logical-width": `${logicalGameWidth}px`,
          }}
        >
          {!useCompactHeader && (
            <div className={style.headerShell} ref={headerShellRef} style={{ width: `${scaledStage.width}px`, maxWidth: "100%" }}>
              <Header isBattle={Boolean(combatData)} playerHp={playerHp} onUseItem={handleItemUse} onSave={handleSaveGame} />
            </div>
          )}

          <div className={style.gameArea}>
            {useCompactHeader && !shouldShowLandscapePrompt && (
              <div className={style.mobileMenuAnchor}>
                <Header compactMenu isBattle={Boolean(combatData)} playerHp={playerHp} onUseItem={handleItemUse} onSave={handleSaveGame} />
              </div>
            )}

            {shouldShowTouchControls && (
              <>
                <div className={`${style.sideControlsOverlay} ${style.sideControlsOverlayLeft}`}>
                  <TouchControls />
                </div>
                <div className={`${style.sideControlsOverlay} ${style.sideControlsOverlayRight}`}>
                  <TouchControls variant="action" />
                </div>
              </>
            )}

            {shouldShowLandscapePrompt ? (
              <div className={style.orientationCard}>
                <h2 className={style.orientationTitle}>Rotate to Landscape</h2>
                <p className={style.orientationText}>Mobile gameplay is tuned for landscape mode so the map, dialogue, and combat screens have enough room.</p>
              </div>
            ) : (
              <div
                className={style.gameStageFrame}
                style={{
                  width: `${scaledStage.width}px`,
                  height: `${scaledStage.height}px`,
                }}
              >
                <div
                  className={style.gameWrapper}
                  style={{
                    width: gameWidth,
                    height: gameHeight,
                    minWidth: gameWidth,
                    minHeight: gameHeight,
                    transform: `scale(${scaledStage.scale})`,
                  }}
                >
                  {!combatData && (
                    <Game
                      onCombatTrigger={triggerCombat}
                      playerGridPos={playerGridPos}
                      setPlayerGridPos={setPlayerGridPos}
                      playerDisplayPos={playerDisplayPos}
                      setPlayerDisplayPos={setPlayerDisplayPos}
                      currentMapId={currentMapId}
                      setCurrentMapId={setCurrentMapId}
                      triggerTransition={triggerTransition}
                      isTransitioning={transition.step !== "closed"}
                      isPaused={saveDialogue.isOpen}
                    />
                  )}
                  {combatData && (
                    <Combat
                      enemyId={combatData.enemyId}
                      onCombatEnd={endCombat}
                      playerHp={playerHp}
                      setPlayerHp={setPlayerHp}
                      onPlayerDeath={handlePlayerDeath}
                    />
                  )}

                  <TransitionOverlay step={transition.step} type={transition.type} />
                  <DialogueModal dialogue={saveDialogue} onChoiceSelect={closeSaveDialogue} />
                </div>
              </div>
            )}
          </div>
        </div>
      </InventoryProvider>
    </QuestProvider>
  );
};

export default GamePage;
