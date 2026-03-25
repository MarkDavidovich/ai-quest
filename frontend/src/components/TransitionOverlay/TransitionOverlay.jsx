import React from "react";
import styles from "./TransitionOverlay.module.css";

/**
 * step: 'closed' | 'entering' | 'black' | 'exiting'
 * type: 'map' | 'battle'
 */
const TransitionOverlay = ({ step, type }) => {
  if (step === "closed") return null;

  const isMap = type === "map";
  const isBattle = type === "battle";

  // Determing the animation state class
  const stateClass = 
    step === "entering" || step === "black" ? styles.active : "";

  return (
    <div className={`${styles.container} ${isBattle ? styles.battle : ""}`}>
      {/* MAP TRANSITION: Simple fade */}
      {isMap && (
        <div className={`${styles.mapFade} ${stateClass}`} />
      )}

      {/* BATTLE TRANSITION: Flash + Split Swipe */}
      {isBattle && (
        <>
          <div className={`${styles.flash} ${step === "entering" ? styles.flashActive : ""}`} />
          <div className={styles.swipeContainer}>
            <div className={`${styles.swipeTop} ${stateClass}`} />
            <div className={`${styles.swipeBottom} ${stateClass}`} />
          </div>
        </>
      )}
    </div>
  );
};

export default TransitionOverlay;
