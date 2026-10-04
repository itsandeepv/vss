/**
 * Builds the hero background video from REAL VSS photos — run with `npm run video`.
 *
 * Each photo gets a slow "Ken Burns" zoom/pan, clips are joined with crossfades,
 * and the result is exported as silent, web-optimised H.264 MP4 in two sizes:
 *
 *   public/video/hero-720.mp4   1280×720  (desktop / tablet)
 *   public/video/hero-480.mp4    854×480  (phones)
 *   public/video/hero-poster.webp          (first frame — shown instantly, and to reduced-motion users)
 *
 * To use real footage instead, drop an .mp4/.mov into _source/video/ and run this script —
 * it will be cut to ≤ 24 s, muted and re-encoded to the same two sizes.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "public", "video");
mkdirSync(out, { recursive: true });

/** Photos in play order, with a vertical focal point (0 = top, 1 = bottom) and pan direction. */
const CLIPS = [
  { file: "guards-night-lineup.png", focusY: 0.45, motion: "in" },
  { file: "guards-warehouse-lineup.png", focusY: 0.4, motion: "right" },
  { file: "guards-black-uniform-five.png", focusY: 0.35, motion: "out" },
  { file: "guards-indoor-four.png", focusY: 0.3, motion: "left" },
  { file: "team-independence-day.png", focusY: 0.5, motion: "in" },
];
const CLIP_SECONDS = 5;
const FADE = 1;
const FPS = 30;

function run(args) {
  const r = spawnSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg failed (${r.status})`);
}

/** zoompan expressions for each motion; the source is pre-scaled 3× so the movement is smooth. */
function motion(kind, frames) {
  const z = { in: `1+0.12*on/${frames}`, out: `1.12-0.12*on/${frames}`, left: "1.1", right: "1.1" }[kind];
  const cx = "iw/2-(iw/zoom/2)";
  const x = {
    in: cx,
    out: cx,
    left: `(iw-iw/zoom)*(1-on/${frames})`,
    right: `(iw-iw/zoom)*(on/${frames})`,
  }[kind];
  return { z, x, y: "ih/2-(ih/zoom/2)" };
}

function fromPhotos(target, w, h, crf) {
  const frames = CLIP_SECONDS * FPS;
  const inputs = [];
  const chains = [];
  CLIPS.forEach((c, i) => {
    // single still frame in — zoompan expands it to `frames` output frames
    inputs.push("-i", path.join(root, "_source", "photos", c.file));
    const W = w * 3;
    const H = h * 3;
    const m = motion(c.motion, frames);
    // cover-crop to 16:9 around the focal point, upscale for smooth zoompan, then grade slightly darker/cooler
    chains.push(
      `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=increase,` +
        `crop=${W}:${H}:(iw-${W})/2:(ih-${H})*${c.focusY},` +
        `zoompan=z='${m.z}':x='${m.x}':y='${m.y}':d=${frames}:s=${w}x${h}:fps=${FPS},` +
        `eq=brightness=-0.03:saturation=0.9,setsar=1,format=yuv420p[v${i}]`,
    );
  });
  // crossfade the clips together
  let last = "v0";
  let offset = CLIP_SECONDS - FADE;
  for (let i = 1; i < CLIPS.length; i++) {
    const outLabel = i === CLIPS.length - 1 ? "joined" : `x${i}`;
    chains.push(`[${last}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${offset}[${outLabel}]`);
    last = outLabel;
    offset += CLIP_SECONDS - FADE;
  }
  const total = CLIPS.length * CLIP_SECONDS - (CLIPS.length - 1) * FADE;
  // fade in/out of navy so the loop point is seamless under the dark hero overlay
  chains.push(`[joined]fade=t=in:st=0:d=0.8:color=0x0b1324,fade=t=out:st=${total - 0.8}:d=0.8:color=0x0b1324[final]`);
  run([...inputs, "-filter_complex", chains.join(";"), "-map", "[final]", ...encode(crf), target]);
}

function fromFootage(src, target, w, h, crf) {
  run([
    "-i",
    src,
    "-t",
    "24",
    "-an",
    "-vf",
    `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},fps=${FPS},eq=saturation=0.9,format=yuv420p`,
    ...encode(crf),
    target,
  ]);
}

function encode(crf) {
  return [
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    String(crf),
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-an",
    "-movflags",
    "+faststart",
  ];
}

const footageDir = path.join(root, "_source", "video");
const footage = existsSync(footageDir) ? readdirSync(footageDir).find((f) => /\.(mp4|mov|m4v|webm)$/i.test(f)) : null;

for (const [name, w, h, crf] of [
  ["hero-720.mp4", 1280, 720, 28],
  ["hero-480.mp4", 854, 480, 29],
]) {
  const target = path.join(out, name);
  if (footage) fromFootage(path.join(footageDir, footage), target, w, h, crf);
  else fromPhotos(target, w, h, crf);
  console.log(`✓ ${path.relative(root, target)}`);
}

// Poster = a frame ~1 s in (after the fade-in), as WebP.
const posterPng = path.join(out, "poster.png");
run(["-ss", "1.2", "-i", path.join(out, "hero-720.mp4"), "-frames:v", "1", posterPng]);
const { default: sharp } = await import("sharp");
await sharp(posterPng).webp({ quality: 72 }).toFile(path.join(out, "hero-poster.webp"));
(await import("node:fs")).unlinkSync(posterPng);
console.log("✓ public/video/hero-poster.webp");
