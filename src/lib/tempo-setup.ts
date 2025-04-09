// This file is no longer used - initialization moved to main.tsx
import { TempoDevtools } from "tempo-devtools";

export function initTempoDevtools() {
  console.warn(
    "This function is deprecated. Tempo initialization moved to main.tsx",
  );
  if (import.meta.env.VITE_TEMPO === "true") {
    TempoDevtools.init();
  }
}
