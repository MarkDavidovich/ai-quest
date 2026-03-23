import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./index.css";
import App from "./App.jsx";

const appFontFamily = "'Jersey 25', system-ui, sans-serif";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider
      theme={{
        fontFamily: appFontFamily,
        headings: {
          fontFamily: appFontFamily,
        },
      }}
    >
      <App />
    </MantineProvider>
  </StrictMode>
);
