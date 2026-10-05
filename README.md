# Vanshika Security Service (VSS) — Website

Multi-page business website for **Vanshika Security Service (VSS)**, a PSARA-licensed security & manpower agency in Farrukhnagar, Gurugram, Haryana.

- **Stack:** Next.js 16 (App Router, TypeScript), run as a small **Node.js server** (`output: "standalone"`). All pages are still prerendered at build time; the server is only needed for the enquiry form's SMTP email (`/api/enquiry`). Plain CSS with custom properties — no Tailwind, no UI framework, no PHP.
- **Contact form:** validated in the browser and again on the server, then emailed over **SMTP (Nodemailer)** as a branded HTML email to `vssagency05@gmail.com`, plus an optional branded thank-you email to the customer. SMTP credentials live only in server environment variables.
- **Hosting:** any host that runs Node.js 20+ — cPanel **Setup Node.js App**, Vercel, or a VPS (see [Deployment](#deployment)).
- **Lighthouse (mobile, local test, with hero video):** Performance 95–97 · Accessibility 100 · Best Practices 100 · SEO 100 (LCP 2.6–3.0 s simulated slow-4G, CLS 0, TBT 0 ms).

All business facts come from [`content.md`](content.md) (compiled from the VSS brochure) and live in code in [`src/content/site.ts`](src/content/site.ts). Nothing has been invented — unknown values are `null` and show a **"To be confirmed"** placeholder on the page. See [TODO list](#todo--client-data-still-needed).

---

## Folder structure

```
security-web/
├── content.md                  # Source of truth for business facts (from the brochure)
├── src/
│   ├── content/site.ts         # ALL site data: contacts, PSARA, stats, services, clients, hero slides…
│   ├── app/
│   │   ├── layout.tsx          # <head>: SEO meta, Open Graph/Twitter, JSON-LD schema, fonts
│   │   ├── page.tsx            # Home (hero video + all key sections + enquiry form)
│   │   ├── about/ services/ services/[slug]/ gallery/ contact/ credits/   # other pages
│   │   │                       #   services/[slug] generates one page per service in site.ts
│   │   ├── globals.css         # All styles (mobile-first, brand tokens at the top)
│   │   ├── api/enquiry/route.ts # Contact form endpoint: validation, anti-spam, SMTP email
│   │   ├── not-found.tsx       # 404 page
│   │   ├── robots.ts / sitemap.ts / manifest.ts   # → robots.txt, sitemap.xml, manifest.webmanifest
│   │   └── favicon.ico, icon.png, apple-icon.png  # generated from the logo
│   ├── components/
│   │   ├── sections.tsx        # Shared page sections (PageHero, ServicesGrid, Industries, Process, CtaBand…)
│   │   ├── Chrome.tsx          # Top bar, footer, WhatsApp button (rendered on every page by layout.tsx)
│   │   └── Header, HeroVideo, Stats, Gallery, ContactForm, Reveal, Icon…
│   ├── lib/meta.ts             # Per-page title / description / canonical / Open Graph
│   ├── lib/enquiry.ts          # Form validation shared by browser + server
│   ├── lib/mail/templates.ts   # Branded HTML + text email templates (enquiry, auto-reply)
│   ├── lib/mail/transport.ts   # Nodemailer SMTP transport from MAIL_* env vars
│   └── lib/hooks.ts            # useReducedMotion, useCurrentYear
├── public/
│   ├── og-image.jpg            # 1200×630 social share image (generated)
│   ├── video/                  # hero-720.mp4, hero-480.mp4, hero-poster.webp (generated)
│   └── images/                 # Optimised WebP output — DO NOT put originals here
├── _source/                    # ORIGINAL images (never deployed). Logo lives here.
│   ├── photos/  flyers/  team/  clients/   # drop new originals here, then `npm run images`
│   └── video/                              # (optional) real footage for the hero — then `npm run video`
├── scripts/
│   ├── optimize-images.mjs     # _source → public/images (WebP, resized), favicons, OG image
│   ├── make-hero-video.mjs     # real photos (or footage) → hero background MP4s + poster
│   ├── postbuild.mjs           # assembles .next/standalone (server + public + static)
│   ├── mail-verify.mjs         # `npm run mail:verify` — checks SMTP login, sends nothing
│   └── smtp-sink.mjs           # `npm run mail:sink` — local SMTP catcher with HTML previews
├── refernce-content/           # Brochure PDFs — reference only, NEVER upload (contains private phone numbers)
├── .env                        # Your real settings (git-ignored) — see .env.example
└── .next/standalone/           # ← build output: the complete app to deploy (npm run build)
```

---

## Pages

| URL | Content |
| --- | --- |
| `/` | Hero video, stats, about, why us, services, industries, process, PSARA, gallery preview, clients, enquiry form |
| `/about/` | Company story, stats, Managing Director, what we do, why us, management team, PSARA |
| `/services/` | All services, industries, process, why us |
| `/services/<service>/` | One page per service (9): overview, what's included, ideal-for industries, sticky quote card, other services. "Request a Quote" opens `/contact/?service=<id>` with the service preselected |
| `/gallery/` | Filterable photo + flyer gallery with lightbox |
| `/contact/` | Contact details, map, enquiry form |
| `/credits/` | Licences for the free stock images (not indexed) |

Every page has its own title, description, canonical URL, breadcrumb (+ BreadcrumbList schema) and is in `sitemap.xml`; service pages also carry `Service` schema. URLs end in `/` (`/about/`; `/about` redirects).

To add a service: add an entry to `services` in `src/content/site.ts` (id, title, text, intro, includes, idealFor, image) and rebuild — its page, menu item, footer link and sitemap entry are generated automatically.

## Getting started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env            # then fill in the values (see below)
npm run mail:verify             # checks the SMTP login — sends nothing
npm run dev                     # http://localhost:3000 (live reload; the form sends real email)
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build → `.next/standalone/` (server + assets, ready to deploy) |
| `npm run start` | Run the production build (`node .next/standalone/server.js`) — env vars from the host |
| `npm run start:local` | Same, loading variables from `.env` |
| `npm run mail:verify` | Log in to the SMTP server with `.env` settings and report — **no email sent** |
| `npm run mail:sink` | Local SMTP catcher on port 2525 that saves each email as `.mail-sink/*.html` |
| `npm run images` | Regenerate optimised images, favicons, email logo and OG image from `_source/` |
| `npm run video` | Rebuild the hero background video (`public/video/`) from `_source/photos/` or `_source/video/` |
| `npm run lint` | ESLint |

### Environment variables

| Variable | When read | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build | Live domain, e.g. `https://www.vssecurity.in` (no trailing slash): canonical URLs, Open Graph, sitemap, schema. **Required before launch.** |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_ENCRYPTION` | runtime | SMTP server. Gmail/Workspace: `smtp.gmail.com`, `587`, `tls` (or `465` + `ssl`). |
| `MAIL_USERNAME`, `MAIL_PASSWORD` | runtime | SMTP login. **Gmail needs an App Password** (Google Account → Security → 2-Step Verification → App passwords), not the normal password. |
| `MAIL_FROM_ADDRESS` | runtime | Sender address. With Gmail this must be the logged-in account (or a verified "Send mail as" alias). |
| `MAIL_TO_ADDRESS` | runtime | Where enquiries are delivered. Default `vssagency05@gmail.com`. |
| `ENQUIRY_FROM_NAME` | runtime | Sender display name. Default `VSS Website`. (`MAIL_FROM_NAME` is deliberately ignored — see note below.) |
| `MAIL_AUTO_REPLY` | runtime | `true`/`false`: send the customer a thank-you email. Default: on only when `MAIL_FROM_ADDRESS` is the VSS email. |
| `ENQUIRY_SECRET` | runtime | Optional long random string for signing anti-spam tokens (otherwise random per server start). |

`MAIL_*` values are never prefixed `NEXT_PUBLIC_`, so they never reach the browser. `.env` is git-ignored — don't commit it. Note: `npm run build` copies `.env` into `.next/standalone/`, so treat that folder as secret too (or delete `.next/standalone/.env` and set the variables in the hosting panel instead — recommended).

> **Current `.env` note:** the SMTP account in `.env` today is **support@zingdates.com** (with sender name "ZingDates"). Enquiries will still be delivered to vssagency05@gmail.com, shown as from "VSS Website", and the customer auto-reply is **off** so VSS customers never receive mail from a ZingDates address. For a fully VSS-branded setup, create an App Password for `vssagency05@gmail.com` and set `MAIL_USERNAME` / `MAIL_FROM_ADDRESS` to it — the auto-reply then switches on automatically.

---

## Contact form & emails

Flow: browser form → `POST /api/enquiry/` → server validates → Nodemailer sends over SMTP.

**Emails sent**
1. **To VSS** (`MAIL_TO_ADDRESS`) — subject `New Enquiry – {Service} – {Name}`. Branded HTML (logo, gold/navy header), one-tap **Call**, **WhatsApp** and **Reply by Email** buttons, a details table (name, phone, email, service, guards, company/site, location), the message, time (IST) and the page it was sent from. **Reply-To is the customer**, so just hit Reply. A plain-text version is included.
2. **To the customer** (only if they gave an email and auto-reply is on) — "Thank you, {Name}!", a summary of their request, *what happens next* (call → site survey → plan & quote) and VSS contact numbers.

Templates are in `src/lib/mail/templates.ts` (table layout + inline styles so they render in Gmail, Outlook and phone apps; the logo is embedded, so it shows even before the domain is live).

**Validation & spam protection** (server-side, can't be bypassed from the browser)
- Same rules in browser and server (`src/lib/enquiry.ts`): Name 2–80 chars, 10-digit Indian mobile (6–9 start; `+91`/`0` accepted), optional valid email, service must be one of ours, guards numeric, message ≤ 2000 chars. Control characters/line breaks are stripped from single-line fields (no email-header injection); all values are HTML-escaped in the email.
- Hidden honeypot field — bots that fill it get a fake "success".
- Signed time token issued when the form loads; submissions under 3 s (or with an expired/forged token) are rejected.
- 5 enquiries per hour per IP address.
- Clear inline errors (server field errors are shown next to the field), button disabled while sending, phone + WhatsApp fallback on failure. SMTP errors are logged on the server without credentials.

### Testing without sending real email

```bash
npm run mail:sink        # terminal 1 — catches mail on localhost:2525
npm run build
cd .next/standalone && PORT=4173 MAIL_HOST=127.0.0.1 MAIL_PORT=2525 MAIL_ENCRYPTION=none \
  MAIL_USERNAME= MAIL_PASSWORD= MAIL_FROM_ADDRESS=vssagency05@gmail.com node server.js   # terminal 2
```

Submit the form at http://localhost:4173/contact/ and open the newest `.mail-sink/*.html` in a browser to see each email exactly as designed. (`npm run dev` with your real `.env` sends real email to `MAIL_TO_ADDRESS`.)

---

## Adding photos & logos

Originals go in `_source/`, never in `public/`. Then run `npm run images`, which writes optimised WebP copies:

| Put originals in | Output | Used for |
| --- | --- | --- |
| `_source/photos/` | `public/images/photos/<name>.webp` (≤1920 px) **and** `<name>-800.webp` (800 px) | Hero slides (large + mobile) and service cards (800) |
| `_source/team/` | `public/images/team/<name>.webp` (≤600 px) | MD / team portraits |
| `_source/clients/` | `public/images/clients/<name>.webp` (120 px tall) | Client logo marquee |

Then reference them in `src/content/site.ts`:

- **Photos:** add an entry to the `photos` catalogue — `photo("file-name-without-extension", "alt text", "50% 40%")` (the last argument is the focal point for cropping) — and use it in `services[].image` or the `gallery` list. Cards with `image: null` show an icon panel instead. To change which photos appear in the hero video, edit `CLIPS` in `scripts/make-hero-video.mjs` and run `npm run video`.
- **MD photo:** `md.photo = "/images/team/laxmi-narain.webp"`.
- **Client logos:** add `logo: "/images/clients/samsung.webp"` to that client's entry — the marquee then shows the logo (greyscale → colour on hover) instead of the text badge.

**Currently in use:** the 8 staff photos in `_source/photos/` (hero video, 6 service cards, gallery) and the 5 flyers in `_source/flyers/` (gallery → "Flyers" tab, with their full text as alt text). The images inside the brochure PDF are stock photos (several watermarked) and are not used.

**Free-licence stock images** (`_source/stock/`, from Wikimedia Commons — public domain, CC0 or CC BY) fill the gaps: industry tiles, and the Gunman (cash-in-transit van), Electro-Mechanical (DG set) and PSO banner (CCTV) images. Their alt text describes only the scene; they are never labelled as VSS staff or sites. Author and licence for each are in `_source/stock/credits.json` and shown on `/credits/` (required for the CC BY ones). **Replace them with real VSS photos when available** and remove the entry from `imageCredits` in `site.ts`. Unsplash/Pexels were not used because they need an API key or block automated access.

### Hero background video

`npm run video` builds a 21-second silent loop from the real staff photos (slow zoom/pan on each photo, crossfades, navy fade at the loop point):

- `public/video/hero-720.mp4` (~2.2 MB, desktop), `hero-480.mp4` (~1.1 MB, phones), `hero-poster.webp` (first frame).
- The poster appears instantly (it is the LCP image); the video only starts downloading after the page has loaded, then fades in.
- Not played for visitors with *reduced motion* or *data saver* turned on. They see the poster. A pause/play button is always shown.
- **Have real drone or site footage?** Put one `.mp4`/`.mov` in `_source/video/` and run `npm run video` — it is trimmed to 24 s, muted and encoded to the same two files automatically.

The edit order, durations and pan directions are at the top of `scripts/make-hero-video.mjs`.

### Animations

All motion is CSS-first, and **everything is switched off for visitors with "reduce motion" enabled** in their OS:

- Hero: copy fades up in sequence on load; poster slow-zoom; video crossfade; rotating captions.
- Scroll reveals (IntersectionObserver): sections fade/slide in; cards stagger; About and Contact slide in from the sides; industries zoom in.
- Process: connector line draws across, then the six steps appear one by one.
- Hover: card lift with growing gold accent bar and icon flip; service photo slow-zoom; gold buttons get a light sweep; gallery zoom + caption slide-up.
- Stats count up; client logos marquee; PSARA seal and WhatsApp button have a soft pulse; gold reading-progress bar at the top; header tightens on scroll.
- Gallery: filter chips (All / Our Team / Flyers) with staggered re-entry; lightbox with ←/→ keys, swipe, Esc, and focus returns to the photo.

## Deployment

The app needs **Node.js 20+** on the server (static-only hosting can't send SMTP email). Build once, then deploy the self-contained `.next/standalone/` folder.

```bash
npm ci
npm run build            # → .next/standalone/ (server.js + public/ + .next/static/)
```

### Option A — cPanel "Setup Node.js App" (most Indian shared hosts: Hostinger, GoDaddy, BigRock…)

1. Check your plan has **Setup Node.js App** (Software section). If not, ask the host or use option B/C.
2. Locally run `npm run build`, then zip the **contents** of `.next/standalone/` (`cd .next/standalone && zip -r ../../vss-app.zip . -x ".env" && cd ../..` — the `.env` is excluded on purpose).
3. cPanel → File Manager → create a folder **outside** `public_html`, e.g. `/home/<user>/vss-app`, upload and extract the zip there.
4. cPanel → **Setup Node.js App** → **Create Application**:
   - Node.js version: 20 or newer · Application mode: Production
   - Application root: `vss-app` · Application URL: your domain · Startup file: `server.js`
5. In the same screen add **Environment variables**: `NEXT_PUBLIC_SITE_URL` is already baked in at build time; add `MAIL_HOST`, `MAIL_PORT`, `MAIL_ENCRYPTION`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`, `MAIL_TO_ADDRESS`, `ENQUIRY_SECRET` (and optionally `ENQUIRY_FROM_NAME`, `MAIL_AUTO_REPLY`). Save → **Restart**.
6. No `npm install` is needed — standalone already contains the required `node_modules`.
7. cPanel → **Domains** → turn on **Force HTTPS Redirect** (after SSL is issued).
8. Visit the site and send a test enquiry; check the inbox and spam folder.

To update: build again, re-upload/extract over `vss-app`, then **Restart** the app.

### Option B — Vercel (free tier, simplest)

Import the Git repository at vercel.com → add the same environment variables in *Project → Settings → Environment Variables* → Deploy. (Vercel ignores `standalone` and runs it natively.) Point the domain's DNS to Vercel.

### Option C — VPS (DigitalOcean, AWS Lightsail…)

Copy `.next/standalone/` to the server, set the environment variables, and run `node server.js` under a process manager (`pm2 start server.js --name vss`) behind Nginx with Let's Encrypt SSL. Set `PORT` if needed.

### Domain & SSL checklist

- [ ] Domain DNS pointed at the hosting
- [ ] `NEXT_PUBLIC_SITE_URL` set to the final `https://…` domain and the site rebuilt
- [ ] SSL issued (cPanel AutoSSL / Vercel automatic / Let's Encrypt) and HTTP → HTTPS redirect on
- [ ] SMTP variables set on the host; `npm run mail:verify` passes locally with the same values
- [ ] Test enquiry received at vssagency05@gmail.com (mark "Not spam" the first time)
- [ ] Google Search Console: add the domain, submit `https://<domain>/sitemap.xml`
- [ ] Google Business Profile with the same name, address and phone as the site
- [ ] Check the share preview (WhatsApp / LinkedIn / <https://www.opengraph.xyz>)

---

## SEO & accessibility notes

- Title/description target *security guard services Gurugram*, *security agency Farrukhnagar*, *PSARA security agency Haryana*.
- Open Graph + Twitter card (`/og-image.jpg`), favicon set, web manifest, canonical URL, `robots.txt`, `sitemap.xml`.
- JSON-LD `LocalBusiness` + `ProfessionalService` (schema.org has no `SecurityService` type) with address, phones, email, founder, and `areaServed` Gurugram, Farrukhnagar, Pataudi, Haryana, Delhi NCR.
- Fonts (Poppins + Inter) are self-hosted at build time by `next/font` — no request to Google from visitors.
- Semantic landmarks, one `h1`, ordered headings, skip link, alt text on all images, AA contrast, keyboard-operable menu (Esc closes) and slider (arrow keys, pause button — WCAG 2.2.2), visible focus rings.
- `prefers-reduced-motion`: slider doesn't auto-play, counters show final numbers, scroll-reveal and marquee animations are disabled (client list becomes a static wrap).

---

## TODO — client data still needed

Search the code for `TODO: confirm` to find every placeholder. Nothing below has been guessed.

| # | Item | Where it goes | Currently shows |
| --- | --- | --- | --- |
| 1 | **PSARA licence number** | `psara.licenceNo` in `src/content/site.ts` | "To be confirmed" in PSARA strip |
| 2 | **PSARA licence validity** (expiry date) | `psara.validity` | "To be confirmed" |
| 3 | **States named on the PSARA licence(s)** | `psara.licensedStates` | Brochure wording "Delhi NCR & North India" |
| 4 | **Website domain** | `NEXT_PUBLIC_SITE_URL` | `https://www.example.com` (canonical, OG, sitemap, schema) |
| 5 | **VSS mailbox for SMTP** — App Password for vssagency05@gmail.com (current `.env` uses support@zingdates.com) | `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS` | Works via the ZingDates account; customer auto-reply off |
| 6 | **Confirm WhatsApp number** (brochure: 8607323237 for "WhatsApp or Call") | `business.whatsapp` | 91 86073 23237 |
| 7 | **Exact Google Maps pin** for the office | `business.mapEmbedUrl`, `business.mapLinkUrl` | Map searched by "Joniawas, Farrukhnagar, Gurugram 122504" |
| 8 | Confirm the client is happy for the staff in the supplied photos to appear publicly | `photos` in `site.ts` | 8 staff photos (hero + 6 service cards) |
| 9 | **Real photos for PSO, Gunman, Electro-Mechanical** and the industry tiles | `_source/photos/` → `services[].image`, `industries[].image` | PSO: icon panel; others: free-licence stock images (see /credits/) |
| 10 | **MD and team photos** (9 people listed in the brochure) | `_source/team/` → `md.photo`, `team[].photo` | Initials avatars |
| 11 | **Permission to display client names** + **client logo files** | `clients[]`, `_source/clients/` | Names as text badges (from brochure clientele page) |
| 12 | **Confirm these services are offered** — not in the brochure, added per website brief: Security Supervisors, Bouncers, PSO, Gunman, Event Security | `services[]` (`confirm: true`) | Shown on site |
| 13 | Social media profile URLs (if any) | `business.social` | None shown |
| 14 | Relationship to **"ASM Facility Management Services"** (MG Road, Sukhrali, Sec-17 Gurugram) shown on the brochure — should it appear on the site? | — | Not shown |
| 15 | Preferred domain form (`www` vs non-`www`) and hosting choice (cPanel Node.js App / Vercel / VPS) | hosting panel | — |
| 16 | A **website-safe brochure PDF** for a "Download Brochure" button (the current brochure includes client reference persons' phone numbers and pricing, so it must not be published) | — | No brochure CTA |
| 17 | Exact business name spelling — brochure uses both "Vanshika Security **Service**" and "Vanshika Security **Services**" | `business.name` | "Vanshika Security Service" |
| 18 | **Facts found only on the flyers** — second phone 8814841354, "Pataudi Road" address line, PIN **122506 vs 122504**, Azad Singh's title (Director vs Head Sales & Mktg), "PSARA certified company" | `business` in `site.ts` | Site text uses brochure values, **but the flyers themselves are now visible in the Gallery**, so please confirm or replace them |
| 19 | Marketing head's surname — brochure has both "Azad **Yadav**" and "Azad **Singh**" | `team` in `site.ts` | "Azad Singh" |
| 20 | Service-page wording (overview / "what's included") — written from the brochure and website brief; please review | `services[].intro`, `includes` | Shown |

Facts used on the site and their source are listed in [`content.md`](content.md). Client reference persons' phone numbers from the brochure are intentionally **not** published anywhere.
# vss
