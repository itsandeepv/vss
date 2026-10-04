"use client";

import { useEffect } from "react";

/**
 * Adds `is-visible` to every `.reveal` element as it scrolls into view.
 * The hidden starting state only applies under `html.js-reveal`, which is set here,
 * so content is never hidden when JS is off or motion is reduced.
 */
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const vh = window.innerHeight;
    // Anything already on screen stays visible; only below-the-fold content animates in.
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh) el.classList.add("is-visible");
    });
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    els.forEach((el) => !el.classList.contains("is-visible") && io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
