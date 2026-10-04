# Vanshika Security Service (VSS) — Website

Single-page business website for **Vanshika Security Service (VSS)**, a PSARA-licensed security & manpower agency in Farrukhnagar, Gurugram, Haryana.

- **Stack:** Next.js 16 (App Router, TypeScript) exported as a **fully static site** (`output: "export"`). Plain CSS with custom properties — no Tailwind, no UI framework. No PHP, no Node server needed in production.
- **Contact form:** posts directly from the browser to [Web3Forms](https://web3forms.com) (free), which emails each enquiry to the business inbox. No SMTP password is stored anywhere.
- **Hosting:** any static host — shared cPanel (Apache) is fully supported via the bundled `.htaccess`.
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
│   │   ├── page.tsx            # The single page — every section in order
│   │   ├── globals.css         # All styles (mobile-first, brand tokens at the top)
│   │   ├── not-found.tsx       # → out/404.html
│   │   ├── robots.ts / sitemap.ts / manifest.ts   # → robots.txt, sitemap.xml, manifest.webmanifest
│   │   └── favicon.ico, icon.png, apple-icon.png  # generated from the logo
│   ├── components/             # Header, HeroVideo, Stats counter, Gallery + lightbox, ContactForm, Reveal, Icon…
│   └── lib/hooks.ts            # useReducedMotion, useCurrentYear
├── public/
│   ├── .htaccess               # HTTPS redirect, gzip, caching, security headers, 404 (Apache/cPanel)
│   ├── og-image.jpg            # 1200×630 social share image (generated)
│   ├── video/                  # hero-720.mp4, hero-480.mp4, hero-poster.webp (generated)
│   └── images/                 # Optimised WebP output — DO NOT put originals here
├── _source/                    # ORIGINAL images (never deployed). Logo lives here.
│   ├── photos/  flyers/  team/  clients/   # drop new originals here, then `npm run images`
│   └── video/                              # (optional) real footage for the hero — then `npm run video`
├── scripts/
│   ├── optimize-images.mjs     # _source → public/images (WebP, resized), favicons, OG image
│   ├── make-hero-video.mjs     # real photos (or footage) → hero background MP4s + poster
│   └── mock-form-endpoint.mjs  # local fake of Web3Forms for testing the form offline
├── refernce-content/           # Brochure PDFs — reference only, NEVER upload (contains private phone numbers)
├── .env.example                # Environment variables to copy into .env.local / .env.production.local
└── out/                        # ← build output: upload THIS folder's contents to the server
```

---

## Getting started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local      # then fill in the values
npm run dev                     # http://localhost:3000 (live reload)
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production static export → `out/` |
| `npm run preview` | Serve `out/` locally at http://localhost:3000 |
| `npm run images` | Regenerate optimised images, favicons and OG image from `_source/` |
| `npm run video` | Rebuild the hero background video (`public/video/`) from `_source/photos/` or `_source/video/` |
| `npm run mock:form` | Fake form endpoint on http://localhost:8787/submit (logs to `.form-log/`) |
| `npm run lint` | ESLint |

### Environment variables

These are baked into the HTML at **build** time — rebuild after changing them.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Live domain, e.g. `https://www.vssecurity.in` (no trailing slash). Used for canonical URL, Open Graph, sitemap, robots and JSON-LD. **Required before launch.** |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Web3Forms key — see below. **Required for the form to work.** |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Local testing only (mock endpoint). Leave empty for production. |

For the production build put them in `.env.production.local` (git-ignored).

---

## Contact form setup (Web3Forms)

The site is static, so there is no server of our own to send email. Web3Forms receives the form submission and emails it to you.

1. Go to <https://web3forms.com>, enter the inbox that should receive enquiries (e.g. `vssagency05@gmail.com`) and click **Create Access Key**. The key arrives by email.
2. Put it in `.env.production.local`:
   ```
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
3. Rebuild (`npm run build`) and re-upload.
4. Send a test enquiry from the live site and check the inbox **and the spam folder** (mark it "Not spam" the first time).

**Why this is safe:** the access key only identifies the destination inbox; it cannot read mail or send to other addresses, and Web3Forms keys are designed to be used in front-end code. **No Gmail App Password or SMTP credentials are needed** — nothing secret ships to the browser. (Optional: in the Web3Forms dashboard you can restrict submissions to your domain.)

**What the email contains:** subject `New Enquiry – {Service} – {Name}`, Reply-To set to the visitor's email (when given, so you can just hit Reply), and a table of all fields: Name, Phone, Email, Company/Site, Location, Service Required, Number of Guards, Message, page URL.

**Validation & spam protection**
- Client-side validation: Name (2–80 chars), Phone (10-digit Indian mobile starting 6–9; `+91`/`0` prefixes accepted), optional valid Email, Service from the dropdown, Number of Guards numeric, Message ≤ 2000 chars. Inline errors, focus moves to the first invalid field.
- Hidden honeypot field (`botcheck`) — Web3Forms also checks it server-side.
- Submissions within 3 s of page load are rejected.
- Per-browser limit of 5 enquiries/hour (localStorage — best-effort). Web3Forms applies its own server-side spam filtering and rate limits on top.
- Inline success/error message, button disabled while sending, no page reload. On failure the visitor is shown the phone number and a WhatsApp link.

> Limitation to know: because there is no server of our own, the 3-second and 5-per-hour checks run in the browser and can be bypassed by a determined bot; Web3Forms' own server-side filtering is the real backstop. If spam becomes a problem, check the CAPTCHA options in the Web3Forms dashboard/docs or move the form to a small serverless function.

### Testing the form locally (no email sent)

```bash
npm run mock:form                                                  # terminal 1
NEXT_PUBLIC_FORM_ENDPOINT=http://localhost:8787/submit npm run build && npm run preview   # terminal 2
```

Submit the form at http://localhost:3000 → each submission is appended to `.form-log/submissions.log`, and the email that *would* be sent is written to `.form-log/<timestamp>.html`. `MOCK_FAIL=1 npm run mock:form` simulates a failure to check the error state.

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

**Currently in use:** the 8 staff photos in `_source/photos/` (hero video, 6 service cards, gallery) and the 5 flyers in `_source/flyers/` (gallery → "Flyers" tab, with their full text as alt text). PSO, Gunman and Electro-Mechanical cards still show icon panels. The images inside the brochure PDF are stock photos (several watermarked) and are not used.

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

## Deploying to cPanel (shared hosting)

1. Build for production:
   ```bash
   npm ci
   npm run build          # with .env.production.local filled in
   ```
2. Zip the **contents** of `out/` (not the folder itself). On macOS: `cd out && zip -r ../site.zip . && cd ..` — `zip -r` includes the hidden `.htaccess`.
3. cPanel → **File Manager** → `public_html` (or the domain's document root). Remove any old site files / default `index.html`.
4. **Upload** `site.zip` → right-click → **Extract** → delete the zip.
5. In File Manager → **Settings** → tick *Show Hidden Files* and confirm `.htaccess` is present in `public_html`.
6. Visit the site, open the menu on a phone, submit a test enquiry.

Do **not** upload `node_modules/`, `src/`, `_source/`, `refernce-content/` or `.env*`. Only the contents of `out/`. (The `.htaccess` also blocks those paths and dotfiles as a safety net.)

To update the site later: edit → `npm run build` → re-upload `out/` contents (overwrite).

### Domain & SSL checklist

- [ ] Domain purchased and DNS pointed at the hosting (A record / nameservers per host's instructions)
- [ ] `NEXT_PUBLIC_SITE_URL` set to the final `https://…` domain and site rebuilt
- [ ] cPanel → **SSL/TLS Status** → run **AutoSSL** (free Let's Encrypt/Sectigo) for `domain` and `www.domain`
- [ ] `https://` loads without warnings; `http://` redirects to `https://` (handled by `.htaccess`)
- [ ] Choose `www` or non-`www` and uncomment the matching redirect block in `public/.htaccess`
- [ ] Once HTTPS is stable, optionally uncomment the HSTS header in `public/.htaccess`
- [ ] Web3Forms access key set; test enquiry received
- [ ] Google Search Console: add the domain, submit `https://<domain>/sitemap.xml`
- [ ] Google Business Profile: create/verify the listing with the same name, address and phone (NAP) as the site
- [ ] Check the share preview (WhatsApp / LinkedIn / <https://www.opengraph.xyz>)

### Alternative hosts

`out/` also deploys as-is to Netlify, Cloudflare Pages, Vercel, GitHub Pages or Hostinger static hosting. `.htaccess` is Apache-only; on those hosts configure the HTTPS redirect / headers in their dashboard (most do HTTPS automatically).

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
| 5 | **Web3Forms access key** (needs inbox owner to create) | `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Form shows "not configured — please call" |
| 6 | **Confirm WhatsApp number** (brochure: 8607323237 for "WhatsApp or Call") | `business.whatsapp` | 91 86073 23237 |
| 7 | **Exact Google Maps pin** for the office | `business.mapEmbedUrl`, `business.mapLinkUrl` | Map searched by "Joniawas, Farrukhnagar, Gurugram 122504" |
| 8 | Confirm the client is happy for the staff in the supplied photos to appear publicly | `photos` in `site.ts` | 8 staff photos (hero + 6 service cards) |
| 9 | **Photos for PSO, Gunman, Electro-Mechanical** service cards | `_source/photos/` → `services[].image` | Icon panels |
| 10 | **MD photo** — Capt. Laxmi Narain | `_source/team/` → `md.photo` | "LN" initials |
| 11 | **Permission to display client names** + **client logo files** | `clients[]`, `_source/clients/` | Names as text badges (from brochure clientele page) |
| 12 | **Confirm these services are offered** — not in the brochure, added per website brief: Security Supervisors, Bouncers, PSO, Gunman, Event Security | `services[]` (`confirm: true`) | Shown on site |
| 13 | Social media profile URLs (if any) | `business.social` | None shown |
| 14 | Relationship to **"ASM Facility Management Services"** (MG Road, Sukhrali, Sec-17 Gurugram) shown on the brochure — should it appear on the site? | — | Not shown |
| 15 | Preferred domain form (`www` vs non-`www`) | `public/.htaccess` | Redirect block commented out |
| 16 | A **website-safe brochure PDF** for a "Download Brochure" button (the current brochure includes client reference persons' phone numbers and pricing, so it must not be published) | — | No brochure CTA |
| 17 | Exact business name spelling — brochure uses both "Vanshika Security **Service**" and "Vanshika Security **Services**" | `business.name` | "Vanshika Security Service" |
| 18 | **Facts found only on the flyers** — second phone 8814841354, "Pataudi Road" address line, PIN **122506 vs 122504**, Azad Singh's title (Director vs Head Sales & Mktg), "PSARA certified company" | `business` in `site.ts` | Site text uses brochure values, **but the flyers themselves are now visible in the Gallery**, so please confirm or replace them |

Facts used on the site and their source are listed in [`content.md`](content.md). Client reference persons' phone numbers from the brochure are intentionally **not** published anywhere.
# vss
