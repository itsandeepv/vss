"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Current calendar year in the browser; `fallback` (the build year) during prerender/hydration. */
export function useCurrentYear(fallback: number) {
  return useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => fallback,
  );
}

const REDUCED = "(prefers-reduced-motion: reduce)";

/** True when the visitor asked the OS for reduced motion. Live-updates if the setting changes. */
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCED);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}
