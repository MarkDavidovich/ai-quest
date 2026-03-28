import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./index.css";
import App from "./App.jsx";
import TransitionOverlay from "./components/TransitionOverlay/TransitionOverlay.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter, useLocation } from "react-router-dom";

const appFontFamily = "'Jersey 25', system-ui, sans-serif";
const ROUTE_TRANSITION_MS = 420;
const ROUTE_BLACK_HOLD_MS = 140;

export function RouteTransitionShell() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [nextLocation, setNextLocation] = useState(null);
  const [transitionStep, setTransitionStep] = useState("black");
  const timerIdsRef = useRef([]);

  const clearTransitionTimers = () => {
    timerIdsRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timerIdsRef.current = [];
  };

  const schedule = (callback, delay) => {
    const timerId = window.setTimeout(callback, delay);
    timerIdsRef.current.push(timerId);
    return timerId;
  };

  useEffect(() => {
    clearTransitionTimers();

    schedule(() => {
      setTransitionStep("exiting");
    }, ROUTE_BLACK_HOLD_MS);

    schedule(() => {
      setTransitionStep("closed");
    }, ROUTE_BLACK_HOLD_MS + ROUTE_TRANSITION_MS);

    return () => {
      clearTransitionTimers();
    };
  }, []);

  useEffect(() => {
    if (location.key === displayLocation.key) {
      return;
    }

    clearTransitionTimers();

    schedule(() => {
      setNextLocation(location);
      setTransitionStep("entering");
    }, 0);
  }, [location, displayLocation.key]);

  useEffect(() => {
    if (transitionStep !== "entering" || !nextLocation) {
      return;
    }

    clearTransitionTimers();

    schedule(() => {
      setTransitionStep("black");
      setDisplayLocation(nextLocation);
    }, ROUTE_TRANSITION_MS);
  }, [transitionStep, nextLocation]);

  useEffect(() => {
    if (!nextLocation || displayLocation.key !== nextLocation.key || transitionStep !== "black") {
      return;
    }

    clearTransitionTimers();

    schedule(() => {
      setTransitionStep("exiting");
    }, ROUTE_BLACK_HOLD_MS);

    schedule(() => {
      setTransitionStep("closed");
      setNextLocation(null);
    }, ROUTE_BLACK_HOLD_MS + ROUTE_TRANSITION_MS);
  }, [displayLocation.key, nextLocation, transitionStep]);

  useEffect(() => {
    const handlePageShow = (event) => {
      if (!event.persisted) {
        return;
      }

      clearTransitionTimers();
      setDisplayLocation(location);
      setNextLocation(null);
      setTransitionStep("closed");
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      clearTransitionTimers();
    };
  }, [location]);

  return (
    <>
      <App routeLocation={displayLocation} />
      <TransitionOverlay step={transitionStep} type="map" fullscreen timing="retro" />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider
        theme={{
          fontFamily: appFontFamily,
          headings: {
            fontFamily: appFontFamily,
          },
        }}
      >
        <AuthProvider>
          <RouteTransitionShell />
        </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
