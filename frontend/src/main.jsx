import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./index.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import RouteTransitionShell from "./components/RouteTransitionShell/RouteTransitionShell.jsx";

const appFontFamily = "'Jersey 25', system-ui, sans-serif";

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
