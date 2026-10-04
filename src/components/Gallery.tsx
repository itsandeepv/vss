"use client";

import { useEffect, useRef, useState } from "react";
import { gallery, type GalleryItem } from "@/content/site";
import { Icon } from "./Icon";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "team", label: "Our Team" },
  { id: "flyers", label: "Flyers" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];

/** Filterable photo grid + lightbox (native <dialog>: focus trap and Esc for free; ←/→ and swipe to navigate). */
export function Gallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const touchX = useRef<number | null>(null);

  const items = filter === "all" ? gallery : gallery.filter((g) => g.kind === filter);
  const current: GalleryItem | null = open === null ? null : items[open];

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const step = (dir: number) => setOpen((i) => (i === null ? i : (i + dir + items.length) % items.length));

  return (
    <>
      <div className="gallery-filters" role="group" aria-label="Filter gallery">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`chip${filter === f.id ? " is-active" : ""}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="gallery-grid" key={filter}>
        {items.map((g, i) => (
          <li key={g.id} className={`gallery-item gallery-item--${g.kind}`} style={{ "--i": i } as React.CSSProperties}>
            <button
              type="button"
              className="gallery-open"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`View larger: ${g.caption}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export */}
              <img src={g.thumb} alt={g.alt} width={g.w} height={g.h} loading="lazy" decoding="async" />
              <span className="gallery-caption" aria-hidden="true">
                {g.caption}
              </span>
              <span className="gallery-zoom" aria-hidden="true">
                <Icon name="plus" size={20} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={current ? current.caption : "Image viewer"}
        onClose={() => {
          setOpen(null);
          openerRef.current?.focus();
        }}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {current && (
          <figure className="lightbox-figure" key={current.id}>
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export */}
            <img src={current.full} alt={current.alt} />
            <figcaption>
              {current.caption}
              <span className="lightbox-count">
                {open! + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
        )}
        <button type="button" className="lightbox-btn lightbox-close" onClick={() => setOpen(null)} aria-label="Close">
          <Icon name="close" size={22} />
        </button>
        <button type="button" className="lightbox-btn lightbox-prev" onClick={() => step(-1)} aria-label="Previous image">
          <Icon name="chevron-left" size={24} />
        </button>
        <button type="button" className="lightbox-btn lightbox-next" onClick={() => step(1)} aria-label="Next image">
          <Icon name="chevron-right" size={24} />
        </button>
      </dialog>
    </>
  );
}
