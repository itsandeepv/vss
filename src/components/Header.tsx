"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { business, nav, serviceHref, services } from "@/content/site";
import { Icon } from "./Icon";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const subRef = useRef<HTMLLIElement>(null);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const close = () => {
    setOpen(false);
    setSubOpen(false);
  };

  // "Get a Quote": from another page, navigate to /contact/#enquiry; when the enquiry form is
  // already on this page, scroll to it and put the cursor in the first field.
  const goToQuote = (e: React.MouseEvent) => {
    close();
    const form = document.getElementById("enquiry");
    if (!form) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    form.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    form.querySelector<HTMLInputElement>("input:not([tabindex='-1'])")?.focus({ preventScroll: true });
    history.replaceState(null, "", "#enquiry");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: Escape closes (focus back to toggle), resizing to desktop closes, body scroll locked.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 960px)");
    const onMq = () => mq.matches && close();
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    document.body.classList.add("nav-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.classList.remove("nav-open");
    };
  }, [open]);

  // Desktop services dropdown: close on outside click / Escape.
  useEffect(() => {
    if (!subOpen || open) return;
    const onDown = (e: MouseEvent) => !subRef.current?.contains(e.target as Node) && setSubOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSubOpen(false);
        subRef.current?.querySelector<HTMLButtonElement>(".sub-toggle")?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [subOpen, open]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${business.name} home`} onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export: images are pre-optimised */}
          <img src="/images/logo-96.webp" srcSet="/images/logo-96.webp 1x, /images/logo-192.webp 2x" width={40} height={48} alt="" />
          <span className="brand-text">
            <span className="brand-name">Vanshika</span>
            <span className="brand-sub">Security Service</span>
          </span>
        </Link>

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
            {nav.map((item) =>
              item.href === "/services/" ? (
                <li
                  key={item.href}
                  ref={subRef}
                  className={`has-sub${subOpen ? " is-sub-open" : ""}`}
                  onMouseEnter={() => !open && setSubOpen(true)}
                  onMouseLeave={() => !open && setSubOpen(false)}
                >
                  <span className="sub-head">
                    <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={close}>
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="sub-toggle"
                      aria-expanded={subOpen}
                      aria-controls="services-menu"
                      onClick={() => setSubOpen((s) => !s)}
                    >
                      <Icon name="chevron-down" size={16} />
                      <span className="sr-only">Show all services</span>
                    </button>
                  </span>
                  <ul id="services-menu" className="sub-menu">
                    {services.map((s) => (
                      <li key={s.id}>
                        <Link href={serviceHref(s.id)} aria-current={pathname === serviceHref(s.id) ? "page" : undefined} onClick={close}>
                          <Icon name={s.icon} size={18} />
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={close}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <Link href="/contact/#enquiry" className="btn btn-gold btn-sm nav-cta" onClick={goToQuote}>
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
