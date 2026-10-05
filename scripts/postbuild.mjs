/**
 * After `next build` (output: "standalone"), copy the static assets next to the server so
 * `.next/standalone` is a complete, self-contained app you can upload/run:
 *
 *   .next/standalone/server.js      ← start this (node server.js)
 *   .next/standalone/public/…       ← images, video, favicons
 *   .next/standalone/.next/static/… ← JS/CSS bundles
 */
import { cpSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, ".next", "standalone");
if (!existsSync(out)) {
  console.error("No .next/standalone folder — is output: 'standalone' set in next.config.ts?");
  process.exit(1);
}
cpSync(path.join(root, "public"), path.join(out, "public"), { recursive: true });
cpSync(path.join(root, ".next", "static"), path.join(out, ".next", "static"), { recursive: true });
console.log("✓ standalone app ready in .next/standalone (run: node .next/standalone/server.js)");
