"use client";

import { useEffect, useRef, useState } from "react";
import { heroCaptions, heroVideo } from "@/content/site";
import { useReducedMotion } from "@/lib/hooks";
import { Icon } from "./Icon";

const CAPTION_MS = 5000;

/**
 * Hero background: poster image paints immediately (fast LCP), then the muted looping
 * video fades in on top once it can play. Skipped for reduced-motion and Save-Data users.
 * A pause button is always available (WCAG 2.2.2), and captions rotate below the CTAs.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  // null = automatic (follows motion preference); true/false after the visitor presses the button.
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reducedMotion;
  const [caption, setCaption] = useState(0);

  // Start/stop the video. `muted` must be set as a property for autoplay to be allowed.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Read the preferences directly: during hydration `playing` briefly assumes "no reduced motion",
    // and we must not start downloading the video for visitors who asked for less motion or data.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!playing || (userPlaying === null && (saveData || prefersReduced))) {
      v.pause();
      return;
    }
    v.muted = true;
    if (v.preload === "none") v.preload = "auto";
    v.play().catch(() => {
      /* autoplay blocked — poster stays visible */
    });
  }, [playing, userPlaying]);

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => setCaption((c) => (c + 1) % heroCaptions.length), CAPTION_MS);
    return () => window.clearInterval(t);
  }, [playing]);

  return (
    <div className="hero-media">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export; poster is the LCP image */}
      <img
        className="hero-poster"
        src={heroVideo.poster}
        alt={heroVideo.alt}
        width={1280}
        height={720}
        fetchPriority="high"
        decoding="async"
      />
      <video
        ref={videoRef}
        className={`hero-video${ready ? " is-ready" : ""}`}
        muted
        loop
        playsInline
        preload="none"
        poster={heroVideo.poster}
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setReady(true)}
      >
        {heroVideo.sources.map((s) => (
          <source key={s.src} src={s.src} type="video/mp4" media={s.media} />
        ))}
      </video>

      <div className="container hero-ui">
        <p className="hero-caption">
          <Icon name="shield" size={18} />
          <span key={caption} className="hero-caption-text">
            {heroCaptions[caption]}
          </span>
        </p>
        <button
          type="button"
          className="hero-btn"
          onClick={() => setUserPlaying(!playing)}
          aria-label={playing ? "Pause background video" : "Play background video"}
        >
          <Icon name={playing ? "pause" : "play"} size={16} />
        </button>
      </div>
    </div>
  );
}
