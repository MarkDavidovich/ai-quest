import { useEffect, useRef } from "react";
import style from "./TouchControls.module.css";

const INITIAL_REPEAT_DELAY_MS = 220;
const REPEAT_INTERVAL_MS = 110;

const dispatchVirtualKey = (key) => {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      cancelable: true,
    }),
  );
};

const TouchControls = ({ variant = "movement", className = "" }) => {
  const repeatDelayRef = useRef(null);
  const repeatIntervalRef = useRef(null);

  const clearRepeater = () => {
    if (repeatDelayRef.current !== null) {
      window.clearTimeout(repeatDelayRef.current);
      repeatDelayRef.current = null;
    }

    if (repeatIntervalRef.current !== null) {
      window.clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
  };

  useEffect(() => clearRepeater, []);

  const handlePressStart = (event, key, repeatable = false) => {
    event.preventDefault();
    clearRepeater();
    dispatchVirtualKey(key);

    if (!repeatable) {
      return;
    }

    repeatDelayRef.current = window.setTimeout(() => {
      repeatIntervalRef.current = window.setInterval(() => {
        dispatchVirtualKey(key);
      }, REPEAT_INTERVAL_MS);
    }, INITIAL_REPEAT_DELAY_MS);
  };

  const handlePressEnd = (event) => {
    event.preventDefault();
    clearRepeater();
  };

  if (variant === "action") {
    return (
      <div className={`${style.actionWrap} ${className}`}>
        <button
          type="button"
          className={`${style.controlButton} ${style.actionButton}`}
          onPointerDown={(event) => handlePressStart(event, "Enter")}
          onPointerUp={handlePressEnd}
          onPointerCancel={handlePressEnd}
          onPointerLeave={handlePressEnd}
        >
          Act
        </button>
      </div>
    );
  }

  return (
    <div className={`${style.pad} ${className}`}>
      <div className={style.padSpacer} />
      <button
        type="button"
        className={style.controlButton}
        aria-label="Move up"
        onPointerDown={(event) => handlePressStart(event, "ArrowUp", true)}
        onPointerUp={handlePressEnd}
        onPointerCancel={handlePressEnd}
        onPointerLeave={handlePressEnd}
      >
        ↑
      </button>
      <div className={style.padSpacer} />

      <button
        type="button"
        className={style.controlButton}
        aria-label="Move left"
        onPointerDown={(event) => handlePressStart(event, "ArrowLeft", true)}
        onPointerUp={handlePressEnd}
        onPointerCancel={handlePressEnd}
        onPointerLeave={handlePressEnd}
      >
        ←
      </button>
      <div className={style.centerBadge}>Move</div>
      <button
        type="button"
        className={style.controlButton}
        aria-label="Move right"
        onPointerDown={(event) => handlePressStart(event, "ArrowRight", true)}
        onPointerUp={handlePressEnd}
        onPointerCancel={handlePressEnd}
        onPointerLeave={handlePressEnd}
      >
        →
      </button>

      <div className={style.padSpacer} />
      <button
        type="button"
        className={style.controlButton}
        aria-label="Move down"
        onPointerDown={(event) => handlePressStart(event, "ArrowDown", true)}
        onPointerUp={handlePressEnd}
        onPointerCancel={handlePressEnd}
        onPointerLeave={handlePressEnd}
      >
        ↓
      </button>
      <div className={style.padSpacer} />
    </div>
  );
};

export default TouchControls;
