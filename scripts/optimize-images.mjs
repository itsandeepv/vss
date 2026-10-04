/**
 * Image pipeline — run with `npm run images`.
 *
 * Originals live in /_source (never shipped). This script writes optimised
 * copies into /public (shipped) and the favicon set into /src/app:
 *
 *   _source/vss-logo.png          → public/images/logo-{96,192,400,600}.webp, logo-512.png,
 *                                   src/app/icon.png, apple-icon.png, favicon.ico,
 *                                   public/og-image.jpg (1200×630)
 *   _source/photos/*.{jpg,jpeg,png,webp}   → public/images/photos/<name>.webp      (max 1920px wide — hero)
 *                                          + public/images/photos/<name>-800.webp  (800px wide — cards, mobile hero)
 *   _source/flyers/*.{jpg,jpeg,png,webp}  → public/images/flyers/<name>.webp (1600px, lightbox) + <name>-800.webp (gallery grid)
 *   _source/team/*.{jpg,jpeg,png,webp}     → public/images/team/<name>.webp     (max 600px wide — portraits)
 *   _source/clients/*.{jpg,jpeg,png,webp,svg} → public/images/clients/<name>.webp (max 120px tall)
 *
 * After adding photos, reference them in src/content/site.ts (see README).
 */
import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = (...p) => path.join(root, "_source", ...p);
const pub = (...p) => path.join(root, "public", ...p);
const app = (...p) => path.join(root, "src", "app", ...p);

const NAVY = "#0b1324";
const GOLD = "#ffcc00";

async function brand() {
  const logo = src("vss-logo.png");

  await mkdir(pub("images"), { recursive: true });
  for (const h of [96, 192, 400, 600]) {
    await sharp(logo)
      .resize({ height: h })
      .webp({ quality: 90 })
      .toFile(pub("images", `logo-${h}.webp`));
  }
  await sharp(logo).resize({ height: 512 }).png({ palette: true, compressionLevel: 9 }).toFile(pub("images", "logo-512.png"));

  // Favicons: logo centred on a square transparent canvas.
  const square = async (size, bg = { r: 0, g: 0, b: 0, alpha: 0 }, pad = 0.06) => {
    const inner = Math.round(size * (1 - pad * 2));
    const fg = await sharp(logo)
      .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
      .composite([{ input: fg, gravity: "centre" }])
      .png({ palette: true, compressionLevel: 9 })
      .toBuffer();
  };
  await writeFile(app("icon.png"), await square(192));
  await writeFile(app("apple-icon.png"), await square(180, NAVY, 0.1));
  await writeFile(pub("images", "icon-192.png"), await square(192, NAVY, 0.1));
  await writeFile(pub("images", "icon-512.png"), await square(512, NAVY, 0.1));

  // favicon.ico with embedded PNGs (16, 32, 48) — ICO format allows PNG payloads.
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => square(s, undefined, 0.02)));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((s, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(s, e);
    header.writeUInt8(s, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(pngs[i].length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += pngs[i].length;
  });
  await writeFile(app("favicon.ico"), Buffer.concat([header, ...pngs]));

  // Open Graph image (1200×630): logo + name + positioning line.
  const ogLogo = await sharp(logo).resize({ height: 400 }).png().toBuffer();
  const text = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="1200" height="8" fill="${GOLD}"/>
      <text x="480" y="250" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700" fill="#ffffff">Vanshika Security</text>
      <text x="480" y="318" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700" fill="#ffffff">Service (VSS)</text>
      <text x="480" y="384" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="${GOLD}">PSARA Licensed Security &amp; Manpower</text>
      <text x="480" y="430" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#c8d0e0">Farrukhnagar · Gurugram · Haryana</text>
    </svg>`);
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: NAVY } })
    .composite([
      { input: ogLogo, left: 90, top: 115 },
      { input: text, left: 0, top: 0 },
    ])
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(pub("og-image.jpg"));

  console.log("✓ brand assets");
}

const slug = (f) =>
  f
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

/** Writes one WebP per source file; `variants` maps a filename suffix ("" or "-800") to resize options. */
async function folder(name, variants) {
  const dir = src(name);
  if (!existsSync(dir)) return;
  const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp|svg)$/i.test(f));
  await mkdir(pub("images", name), { recursive: true });
  for (const f of files) {
    for (const [suffix, resize] of Object.entries(variants)) {
      const out = pub("images", name, `${slug(f)}${suffix}.webp`);
      await sharp(src(name, f))
        .rotate()
        .resize({ ...resize, withoutEnlargement: true })
        .webp({ quality: 76 })
        .toFile(out);
      console.log(`✓ ${name}/${f} → ${path.relative(root, out)}`);
    }
  }
}

await brand();
await folder("photos", { "": { width: 1920 }, "-800": { width: 800 } });
await folder("flyers", { "": { width: 1600 }, "-800": { width: 800 } });
await folder("team", { "": { width: 600 } });
await folder("clients", { "": { height: 120 } });
