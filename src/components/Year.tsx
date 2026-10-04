"use client";

import { useCurrentYear } from "@/lib/hooks";

/** Copyright year — rendered at build time, refreshed in the browser so it never goes stale. */
export function Year({ initial }: { initial: number }) {
  return <>{useCurrentYear(initial)}</>;
}
