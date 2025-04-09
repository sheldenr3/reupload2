import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { TempoDevtools } from "tempo-devtools";

// Initialize Tempo if the environment variable is set
if (import.meta.env.VITE_TEMPO === "true") {
  TempoDevtools.init();
}

// Add global error handler
window.addEventListener("error", (event) => {
  console.error("Global error caught:", event.error);
});

// Add unhandled promise rejection handler
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

console.log("Starting application render");

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Ensure the root element exists
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    const newRoot = document.createElement("div");
    newRoot.id = "root";
    document.body.appendChild(newRoot);
  }

  try {
    // Remove StrictMode to prevent double mounting which can cause issues with auth
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    console.log("App rendered successfully");
  } catch (error) {
    console.error("Failed to render app:", error);
    document.body.innerHTML = `<div style="padding: 20px; font-family: sans-serif;"><h1>Lumerous - Error</h1><p>Failed to load application. Please try refreshing the page.</p><pre>${error}</pre></div>`;
  }
});
