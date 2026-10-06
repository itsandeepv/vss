/* eslint-disable @next/next/no-img-element -- print-only HTML rendered to PDF by Chrome, not a Next.js page */
/**
 * Generates the downloadable company brochure from the website's own data, so the PDF never
 * drifts from the site (one phone number, confirmed stats/clients, current services):
 *
 *   npm run brochure
 *
 * Output (served from the site, linked from the "Download Brochure" buttons):
 *   public/downloads/vanshika-security-service-brochure.pdf   (A4, 6 pages)
 *   public/downloads/brochure-cover.webp                      (thumbnail used on the website)
 *
 * Renders React → HTML, then prints it to PDF with Chrome (puppeteer-core). Set CHROME_PATH if
 * Chrome isn't in a standard location. Re-run whenever site.ts content changes, then rebuild.
 */
import { readFileSync, mkdirSync, writeFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import QRCode from "qrcode";
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import {
  SITE_URL,
  about,
  business,
  clients,
  industries,
  md,
  photos,
  processSteps,
  psara,
  services,
  stats,
  whatsappHref,
  whyUs,
  type Photo,
} from "../../src/content/site";
import { Icon } from "../../src/components/Icon";

const root = path.resolve(import.meta.dirname, "../..");
const outDir = path.join(root, "public", "downloads");
const PDF_NAME = "vanshika-security-service-brochure.pdf";
// Chrome stores WebP images in a PDF uncompressed (16 MB+), but embeds JPEG as-is — so every
// photo is converted to a compressed JPEG copy first (see prepareImages) and the PDF uses those.
const jpgDir = path.join(tmpdir(), "vss-brochure-img");
const pub = (p: string) =>
  /\.webp$/.test(p) && !p.includes("logo")
    ? pathToFileURL(
        path.join(
          jpgDir,
          p
            .replace(/^\/+/, "")
            .replace(/[\/]/g, "_")
            .replace(/\.webp$/, ".jpg"),
        ),
      ).href
    : pathToFileURL(path.join(root, "public", p)).href;
const small = (p: Photo) => pub(p.src.replace(/\.webp$/, "-800.webp"));

async function prepareImages() {
  rmSync(jpgDir, { recursive: true, force: true });
  mkdirSync(jpgDir, { recursive: true });
  for (const folder of ["images/photos", "images/stock"]) {
    const dir = path.join(root, "public", folder);
    for (const f of readdirSync(dir).filter((x) => x.endsWith(".webp"))) {
      const out = path.join(jpgDir, `${folder}/${f}`.replace(/[\/]/g, "_").replace(/\.webp$/, ".jpg"));
      // Full-size images are only used for the cover: cap at 1400px wide.
      await sharp(path.join(dir, f)).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 72, mozjpeg: true }).toFile(out);
    }
  }
}
const domain = SITE_URL.replace(/^https?:\/\//, "");
const [phone] = business.phones;

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean) as string[];
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error("Chrome not found — set CHROME_PATH to your Chrome/Chromium executable.");
  return found;
}

const initials = (n: string) =>
  n
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

function PageFooter({ n }: { n: number }) {
  return (
    <footer className="pf">
      <span>Vanshika Security Service (VSS)</span>
      <span>
        {phone.display} · {business.email} · {domain}
      </span>
      <span className="pf-n">{String(n).padStart(2, "0")}</span>
    </footer>
  );
}

function Head({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="ph">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </header>
  );
}

function Brochure({ qrWhatsApp, qrSite }: { qrWhatsApp: string; qrSite: string }) {
  return (
    <>
      {/* 1 — Cover */}
      <section className="page cover">
        <img className="cover-img" src={pub(photos.nightLineup.src)} alt="" />
        <div className="cover-shade" />
        <div className="cover-top">
          <img className="cover-logo" src={pub("/images/logo-512.png")} alt="VSS logo" />
          <span className="cover-badge">PSARA Licensed</span>
        </div>
        <div className="cover-body">
          <p className="eyebrow light">{business.tagline}</p>
          <h1>
            Vanshika
            <br />
            Security Service
          </h1>
          <p className="cover-sub">PSARA Licensed Security &amp; Manpower Services</p>
          <p className="cover-text">{business.strapline}</p>
          <p className="cover-tag">Company Profile</p>
        </div>
        <div className="cover-bar">
          <span>
            <Icon name="phone" size={16} /> {phone.display}
          </span>
          <span>
            <Icon name="mail" size={16} /> {business.email}
          </span>
          <span>
            <Icon name="pin" size={16} /> Farrukhnagar, Gurugram, Haryana
          </span>
        </div>
        <div className="stripe" />
      </section>

      {/* 2 — About, stats, leadership, PSARA */}
      <section className="page">
        <Head eyebrow="About us" title="Security and facility management you can rely on" />
        <div className="about-grid">
          <div>
            <p className="lead">{about.intro}</p>
            <p>{about.body}</p>
            <ul className="checks">
              {about.points.map((p) => (
                <li key={p}>
                  <Icon name="check" size={15} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <img className="about-img" src={small(photos.indoorFour)} alt="" />
        </div>
        <ul className="stats">
          {stats.map((s) => (
            <li key={s.label}>
              <strong>
                {s.text ?? (s.plain ? String(s.value) : (s.value ?? 0).toLocaleString("en-IN"))}
                {s.suffix}
              </strong>
              <span>{s.label}</span>
              <small>{s.note}</small>
            </li>
          ))}
        </ul>
        <div className="md">
          <div className="md-avatar">LN</div>
          <div>
            <p className="eyebrow light">From the leadership</p>
            <h3>{md.name}</h3>
            <p className="md-role">{md.role} · Ex-Indian Army</p>
            <p className="md-quote">{md.summary}</p>
          </div>
        </div>
        <div className="psara">
          <span className="psara-seal">
            <Icon name="badge" size={26} />
          </span>
          <div>
            <h3>PSARA Licensed Security Agency</h3>
            <p>
              Licensed under the Private Security Agencies (Regulation) Act, 2005 to run a security agency in {psara.coverage}.
              {psara.licenceNo ? ` Licence No. ${psara.licenceNo}` : ""}
              {psara.validity ? `, valid until ${psara.validity}.` : ""}
            </p>
          </div>
        </div>
        <PageFooter n={2} />
      </section>

      {/* 3 — Services */}
      <section className="page">
        <Head eyebrow="Our services" title="Security & manpower services" />
        <p className="intro">
          Manned guarding is our core, backed by facility management, housekeeping and technical support from one agency.
        </p>
        <ul className="svc-grid">
          {services.map((s) => (
            <li key={s.id} className="svc">
              <div className="svc-media">
                {s.image ? <img src={small(s.image)} alt="" /> : <Icon name={s.icon} size={40} />}
                <span className="svc-icon">
                  <Icon name={s.icon} size={16} />
                </span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>
        <PageFooter n={3} />
      </section>

      {/* 4 — Why VSS + process */}
      <section className="page">
        <Head eyebrow="Why choose us" title="Why organisations choose VSS" />
        <ul className="why-grid">
          {whyUs.map((w) => (
            <li key={w.title}>
              <span className="why-icon">
                <Icon name={w.icon} size={20} />
              </span>
              <div>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <Head eyebrow="How we work" title="Our security process" />
        <ol className="steps">
          {processSteps.map((p, n) => (
            <li key={p.title}>
              <span className="step-n">{n + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
        <PageFooter n={4} />
      </section>

      {/* 5 — Industries + clients */}
      <section className="page">
        <Head eyebrow="Industries we serve" title="Security for every type of site" />
        <ul className="ind-grid">
          {industries.map((ind) => (
            <li key={ind.title}>
              <img src={small(ind.image)} alt="" />
              <span>
                <Icon name={ind.icon} size={14} />
                {ind.title}
              </span>
            </li>
          ))}
        </ul>
        <Head eyebrow="Our clientele" title="Trusted by leading businesses" />
        <ul className="clients">
          {clients.map((c) => (
            <li key={c.name}>
              <span className="mono">{initials(c.name)}</span>
              {c.name}
            </li>
          ))}
        </ul>
        <p className="credit">
          Industry photos: Wikimedia Commons contributors (public domain / CC0 / CC BY) — full credits at {domain}/credits/
        </p>
        <PageFooter n={5} />
      </section>

      {/* 6 — Back cover / contact */}
      <section className="page back">
        <div className="back-photos">
          <img src={small(photos.blackFive)} alt="" />
          <img src={small(photos.warehouseLineup)} alt="" />
          <img src={small(photos.gate)} alt="" />
        </div>
        <div className="back-body">
          <img className="back-logo" src={pub("/images/logo-512.png")} alt="VSS logo" />
          <h2>Let&apos;s secure your site</h2>
          <p className="back-lead">Free site survey, deployment plan and quotation — call, WhatsApp or email us.</p>
          <ul className="contact">
            <li>
              <Icon name="phone" size={20} />
              <div>
                <small>Call / WhatsApp</small>
                <strong>{phone.display}</strong>
              </div>
            </li>
            <li>
              <Icon name="mail" size={20} />
              <div>
                <small>Email</small>
                <strong>{business.email}</strong>
              </div>
            </li>
            <li>
              <Icon name="pin" size={20} />
              <div>
                <small>Office</small>
                <strong>{business.address.full}</strong>
              </div>
            </li>
          </ul>
          <div className="qrs">
            <figure>
              <div className="qr" dangerouslySetInnerHTML={{ __html: qrWhatsApp }} />
              <figcaption>Chat on WhatsApp</figcaption>
            </figure>
            <figure>
              <div className="qr" dangerouslySetInnerHTML={{ __html: qrSite }} />
              <figcaption>{domain}</figcaption>
            </figure>
          </div>
          <p className="back-tag">{business.tagline}</p>
        </div>
        <div className="stripe" />
      </section>
    </>
  );
}

async function main() {
  await prepareImages();
  const qr = (text: string) => QRCode.toString(text, { type: "svg", margin: 1, color: { dark: "#0b1324", light: "#ffffff" } });
  const [qrWhatsApp, qrSite] = await Promise.all([qr(whatsappHref), qr(`${SITE_URL}/`)]);

  const css = readFileSync(path.join(import.meta.dirname, "brochure.css"), "utf8");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Vanshika Security Service — Company Profile</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=block" rel="stylesheet">
<style>${css}</style></head><body>${renderToStaticMarkup(<Brochure qrWhatsApp={qrWhatsApp} qrSite={qrSite} />)}</body></html>`;

  mkdirSync(outDir, { recursive: true });
  const htmlPath = path.join(outDir, ".brochure-build.html");
  writeFileSync(htmlPath, html);

  const browser = await puppeteer.launch({
    executablePath: chromePath(),
    headless: true,
    args: ["--no-sandbox", "--allow-file-access-from-files"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    writeFileSync(path.join(outDir, PDF_NAME), pdf);

    // Cover thumbnail for the website (first page at 2× → WebP).
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    const cover = await page.$(".cover");
    const png = await cover!.screenshot({ type: "png" });
    await sharp(png).resize({ width: 600 }).webp({ quality: 80 }).toFile(path.join(outDir, "brochure-cover.webp"));
  } finally {
    await browser.close();
    (await import("node:fs")).unlinkSync(htmlPath);
    rmSync(jpgDir, { recursive: true, force: true });
  }
  const kb = Math.round(readFileSync(path.join(outDir, PDF_NAME)).length / 1024);
  console.log(`✓ public/downloads/${PDF_NAME} (${kb} KB) + brochure-cover.webp`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
