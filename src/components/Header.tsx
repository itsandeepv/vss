"use client";

import { useEffect, useRef, useState } from "react";
import { business, nav } from "@/content/site";
import { Icon } from "./Icon";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape (and return focus to the toggle) or when resizing to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 960px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    document.body.classList.add("nav-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.classList.remove("nav-open");
    };
  }, [open]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="#top" className="brand" aria-label={`${business.name} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export: images are pre-optimised */}
          <img src="/images/logo-96.webp" srcSet="/images/logo-96.webp 1x, /images/logo-192.webp 2x" width={40} height={48} alt="" />
          <span className="brand-text">
            <span className="brand-name">Vanshika</span>
            <span className="brand-sub">Security Service</span>
          </span>
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} />
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>

        <nav id="primary-nav" className={`primary-nav${open ? " is-open" : ""}`} aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-gold btn-sm nav-cta" onClick={() => setOpen(false)}>
            Get a Quote
          </a>
        </nav>
      </div>
    </header>
  );
}
