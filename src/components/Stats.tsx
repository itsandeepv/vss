"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/content/site";
import { useCurrentYear } from "@/lib/hooks";

/** Final value for each stat. "Years" is derived from the founding year so it never goes stale. */
function target(s: (typeof stats)[number], year: number) {
  return "sinceYear" in s && s.sinceYear ? year - s.sinceYear : (s.value ?? 0);
}

export function Stats({ buildYear }: { buildYear: number }) {
  const ref = useRef<HTMLUListElement>(null);
  const year = useCurrentYear(buildYear);
  // null → show final numbers (prerendered HTML, no-JS, reduced motion, and after the count-up).
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1600;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setProgress(p < 1 ? 1 - Math.pow(1 - p, 3) : null);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ul className="stats-grid" ref={ref}>
      {stats.map((s) => {
        const final = target(s, year);
        const shown = progress === null ? final : Math.round(final * progress);
        return (
          <li key={s.label} className="stat">
            <span className="stat-value" aria-hidden="true">
              {shown.toLocaleString("en-IN")}
              {s.suffix}
            </span>
            <span className="sr-only">
              {final}
              {s.suffix} {s.label} {s.note}
            </span>
            <span className="stat-label" aria-hidden="true">
              {s.label}
            </span>
            <span className="stat-note" aria-hidden="true">
              {s.note}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
