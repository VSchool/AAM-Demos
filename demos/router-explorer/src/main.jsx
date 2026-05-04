import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { NavigationProvider } from "./context/NavigationContext";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </HashRouter>
  </StrictMode>
);
