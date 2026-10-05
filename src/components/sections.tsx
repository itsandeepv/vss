import Link from "next/link";
import {
  SITE_URL,
  about,
  business,
  clients,
  gallery,
  industries,
  md,
  photos,
  processSteps,
  psara,
  serviceHref,
  services,
  team,
  whatsappHref,
  whyUs,
  type Photo,
  type Service,
} from "@/content/site";
import { Icon } from "./Icon";
import { Stats } from "./Stats";
import { ContactForm } from "./ContactForm";

/** Shared, server-rendered page sections. Pages compose these in different orders. */

const BUILD_YEAR = new Date().getFullYear();
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;
const small = (p: Photo) => p.src.replace(/\.webp$/, "-800.webp");

/** Shown wherever a fact is still missing from content.md. */
export function Pending({ what }: { what: string }) {
  return (
    <span className="pending" title={`${what}: to be confirmed`}>
      To be confirmed
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  text,
  id,
  light,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  id: string;
  light?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={`section-head reveal${align === "left" ? " section-head--left" : ""}`}>
      <p className={`eyebrow${light ? " eyebrow-light" : ""}`}>{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {text && <p className="section-text">{text}</p>}
    </div>
  );
}

/* ---------- Inner-page banner with breadcrumb (+ BreadcrumbList schema) ---------- */
export function PageHero({
  title,
  tagline,
  image,
  crumbs,
}: {
  title: string;
  tagline?: string;
  image: Photo;
  crumbs: { href: string; label: string }[];
}) {
  const trail = [{ href: "/", label: "Home" }, ...crumbs];
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, n) => ({ "@type": "ListItem", position: n + 1, name: c.label, item: `${SITE_URL}${c.href}` })),
  };
  return (
    <section className="page-hero" aria-labelledby="page-title">
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export; LCP image */}
      <img
        className="page-hero-img"
        src={image.src}
        srcSet={`${small(image)} 800w, ${image.src} 1600w`}
        sizes="100vw"
        alt=""
        width={1600}
        height={900}
        fetchPriority="high"
        style={image.position ? { objectPosition: image.position } : undefined}
      />
      <div className="container page-hero-inner">
        <nav aria-label="Breadcrumb" className="breadcrumb hero-anim">
          <ol>
            {trail.map((c, n) => (
              <li key={c.href}>
                {n < trail.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <h1 id="page-title" className="hero-anim">
          {title}
        </h1>
        {tagline && <p className="page-hero-tagline hero-anim">{tagline}</p>}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </section>
  );
}

/* ---------- Stats ---------- */
export function StatsStrip() {
  return (
    <section className="stats-strip" aria-label="VSS in numbers">
      <div className="container">
        <Stats buildYear={BUILD_YEAR} />
      </div>
    </section>
  );
}

/* ---------- About (split layout with photo collage) ---------- */
export function AboutSplit({ full = false }: { full?: boolean }) {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container about-split">
        <div className="about-collage reveal reveal-left">
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export */}
          <img
            className="about-collage-main"
            src={small(photos.indoorFour)}
            alt={photos.indoorFour.alt}
            width={800}
            height={450}
            loading="lazy"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export */}
          <img
            className="about-collage-sub"
            src={small(photos.blackFive)}
            alt={photos.blackFive.alt}
            width={800}
            height={691}
            loading="lazy"
          />
          <div className="about-badge">
            <span className="about-badge-num">2016</span>
            <span className="about-badge-label">Serving since</span>
          </div>
        </div>
        <div className="reveal reveal-right">
          <p className="eyebrow">About VSS</p>
          <h2 id="about-title">Security and facility management you can rely on</h2>
          <p className="lead">{about.intro}</p>
          {full && <p>{about.body}</p>}
          <ul className="check-list">
            {about.points.map((p) => (
              <li key={p}>
                <Icon name="check" size={18} />
                {p}
              </li>
            ))}
          </ul>
          {!full && (
            <Link href="/about/" className="btn btn-navy">
              More about us
              <Icon name="arrow-right" size={18} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Managing Director ---------- */
export function MdFeature() {
  return (
    <section className="section section-alt" aria-labelledby="md-title">
      <div className="container">
        <div className="md-feature reveal">
          <div className="md-photo md-photo-lg">
            {md.photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export
              <img src={md.photo} alt={`${md.name}, ${md.role}`} width={200} height={200} loading="lazy" />
            ) : (
              // TODO: confirm — MD photo not supplied yet (brochure: "Pic will be updated soon").
              <span className="md-initials" aria-hidden="true">
                LN
              </span>
            )}
          </div>
          <div>
            <p className="md-kicker">From the leadership</p>
            <h2 id="md-title">{md.name}</h2>
            <p className="md-role">{md.role} · Ex-Indian Army</p>
            <blockquote className="md-quote">
              <p>{md.summary}</p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Team ---------- */
export function TeamGrid() {
  const initials = (n: string) =>
    n
      .replace(/^(Capt\.|Mr\.|Ms\.)\s*/, "")
      .split(/[\s.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("");
  return (
    <section className="section" aria-labelledby="team-title">
      <div className="container">
        <SectionHead
          id="team-title"
          eyebrow="Our people"
          title="Management & core team"
          text="Experienced leaders, many from the Indian Army, who run operations, sales and finance at VSS."
        />
        {/* TODO: confirm — team photos ("Pic will be updated soon" in the brochure). */}
        <ul className="team-grid">
          {team.map((t, n) => (
            <li key={t.name} className="team-card reveal" style={i(n % 4)}>
              <span className="team-avatar" aria-hidden="true">
                {initials(t.name)}
              </span>
              <h3>{t.name}</h3>
              <p className="team-role">{t.role}</p>
              <p className="team-note">{t.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Why choose us ---------- */
export function WhyUs({ alt = true }: { alt?: boolean }) {
  return (
    <section className={`section${alt ? " section-alt" : ""}`} aria-labelledby="why-title">
      <div className="container">
        <SectionHead
          id="why-title"
          eyebrow="Why choose us"
          title="Why organisations choose VSS"
          text="We are licensed and verified, our people are trained and supervised, and you get regular reports on every site."
        />
        <ul className="card-grid card-grid-4">
          {whyUs.map((w, n) => (
            <li key={w.title} className="feature-card reveal" style={i(n)}>
              <span className="icon-badge">
                <Icon name={w.icon} size={26} />
              </span>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
export function ServiceCard({ s, n }: { s: Service; n: number }) {
  return (
    <li className="service-card reveal" style={i(n % 3)}>
      <div className={`service-media${s.image ? "" : " service-media--art"}`}>
        {s.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export
          <img
            src={small(s.image)}
            alt={s.image.alt}
            width={800}
            height={450}
            style={s.image.position ? { objectPosition: s.image.position } : undefined}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Icon name={s.icon} size={56} />
        )}
      </div>
      <div className="service-body">
        <span className="service-icon" aria-hidden="true">
          <Icon name={s.icon} size={22} />
        </span>
        <h3>
          {/* Stretched link: the whole card is clickable, but only the title is announced. */}
          <Link href={serviceHref(s.id)} className="stretched-link">
            {s.title}
          </Link>
        </h3>
        <p>{s.text}</p>
        <span className="text-link" aria-hidden="true">
          View details
          <Icon name="arrow-right" size={16} />
        </span>
      </div>
    </li>
  );
}

export function ServicesGrid({ items = services, heading = true }: { items?: Service[]; heading?: boolean }) {
  return (
    <section
      id="services"
      className="section"
      aria-labelledby={heading ? "services-title" : undefined}
      aria-label={heading ? undefined : "Services"}
    >
      <div className="container">
        {heading && (
          <SectionHead
            id="services-title"
            eyebrow="Our services"
            title="Security & manpower services"
            text="Manned guarding is our core, backed by facility management, housekeeping and technical support from one agency."
          />
        )}
        <ul className="card-grid card-grid-3">
          {items.map((s, n) => (
            <ServiceCard key={s.id} s={s} n={n} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Industries (image tiles) ---------- */
export function Industries() {
  return (
    <section id="industries" className="section section-dark" aria-labelledby="industries-title">
      <div className="container">
        <SectionHead
          light
          id="industries-title"
          eyebrow="Industries we serve"
          title="Security for every type of site"
          text="From factories and warehouses to housing societies and retail stores, we staff each site to suit its risks."
        />
        <ul className="industry-grid">
          {industries.map((ind, n) => (
            <li key={ind.title} className="industry-tile reveal reveal-zoom" style={i(n)}>
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export */}
              <img src={small(ind.image)} alt="" width={800} height={533} loading="lazy" decoding="async" />
              <span className="industry-tile-body">
                <span className="industry-tile-icon" aria-hidden="true">
                  <Icon name={ind.icon} size={22} />
                </span>
                <span className="industry-tile-title">{ind.title}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Process ---------- */
export function Process() {
  return (
    <section id="process" className="section" aria-labelledby="process-title">
      <div className="container">
        <SectionHead
          id="process-title"
          eyebrow="How we work"
          title="Our security process"
          text="Six steps from the first site visit to ongoing reporting and improvement."
        />
        <ol className="stepper reveal">
          {processSteps.map((p, n) => (
            <li key={p.title} className="step" style={i(n)}>
              <span className="step-num" aria-hidden="true">
                {n + 1}
              </span>
              <h3>
                <span className="sr-only">Step {n + 1}: </span>
                {p.title}
              </h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- PSARA ---------- */
export function Psara() {
  return (
    <section id="psara" className="psara-strip" aria-labelledby="psara-title">
      <div className="container psara-inner reveal">
        <div className="psara-head">
          <span className="psara-seal" aria-hidden="true">
            <Icon name="badge" size={34} />
          </span>
          <div>
            <h2 id="psara-title">PSARA Licensed Security Agency</h2>
            <p>Licensed under the Private Security Agencies (Regulation) Act, 2005 to run a security agency in {psara.coverage}.</p>
          </div>
        </div>
        <dl className="psara-facts">
          <div>
            <dt>Licence No.</dt>
            {/* TODO: confirm — PSARA licence number */}
            <dd>{psara.licenceNo ?? <Pending what="PSARA licence number" />}</dd>
          </div>
          <div>
            <dt>Valid Until</dt>
            {/* TODO: confirm — PSARA licence validity */}
            <dd>{psara.validity ?? <Pending what="PSARA licence validity" />}</dd>
          </div>
          <div>
            <dt>Coverage</dt>
            {/* TODO: confirm — exact states on the licence */}
            <dd>{psara.licensedStates ?? psara.coverage}</dd>
          </div>
          <div>
            <dt>Operations</dt>
            <dd>{psara.operatingStates.join(", ")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* ---------- Gallery teaser (home) ---------- */
export function GalleryTeaser() {
  const items = gallery.filter((g) => g.kind === "team").slice(0, 6);
  return (
    <section className="section" aria-labelledby="gallery-title">
      <div className="container">
        <SectionHead id="gallery-title" eyebrow="Gallery" title="VSS on the ground" text="Our guards and staff on duty at client sites." />
        <ul className="teaser-grid">
          {items.map((g, n) => (
            <li key={g.id} className={`teaser-item teaser-item--${n} reveal reveal-zoom`} style={i(n)}>
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export */}
              <img src={g.thumb} alt={g.alt} width={g.w} height={g.h} loading="lazy" decoding="async" />
              <span className="teaser-caption" aria-hidden="true">
                {g.caption}
              </span>
            </li>
          ))}
        </ul>
        <div className="center-actions reveal">
          <Link href="/gallery/" className="btn btn-navy">
            View full gallery
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Clients marquee ---------- */
export function Clients() {
  // Rendered twice for a seamless loop; the copy is hidden from assistive tech.
  const row = (hidden: boolean) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {clients.map((c) => (
        <li key={c.name} className={c.logo ? "client-logo" : "client-badge"}>
          {c.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export
            <img src={c.logo} alt={hidden ? "" : c.name} height={60} loading="lazy" />
          ) : (
            c.name
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <section id="clients" className="section section-alt" aria-labelledby="clients-title">
      <div className="container">
        <SectionHead
          id="clients-title"
          eyebrow="Our clientele"
          title="Trusted by 40+ clients across North India"
          text="Some of the brands and businesses whose sites VSS has served."
        />
      </div>
      {/* TODO: confirm — permission to display client names; swap in logos when supplied. */}
      <div className="marquee reveal">
        <div className="marquee-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact (info + map + form) ---------- */
export function ContactBlock({ form, heading = true }: { form?: React.ReactNode; heading?: boolean }) {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        {heading ? (
          <SectionHead
            id="contact-title"
            eyebrow="Contact us"
            title="Get a free security consultation"
            text="Tell us about your site and we will call you back with a plan and a quote."
          />
        ) : (
          // Keeps the heading order (h1 → h2 → h3) on pages that already have a banner title.
          <h2 id="contact-title" className="sr-only">
            Contact details and enquiry form
          </h2>
        )}
        <div className="contact-grid">
          <div className="contact-info reveal reveal-left">
            <ul className="contact-list">
              <li>
                <span className="icon-badge icon-badge-sm">
                  <Icon name="pin" size={20} />
                </span>
                <div>
                  <h3>Office</h3>
                  <address>{business.address.full}</address>
                </div>
              </li>
              <li>
                <span className="icon-badge icon-badge-sm">
                  <Icon name="phone" size={20} />
                </span>
                <div>
                  <h3>Phone</h3>
                  {business.phones.map((p) => (
                    <p key={p.tel}>
                      <a href={`tel:${p.tel}`}>{p.display}</a> <span className="muted">({p.label})</span>
                    </p>
                  ))}
                </div>
              </li>
              <li>
                <span className="icon-badge icon-badge-sm">
                  <Icon name="mail" size={20} />
                </span>
                <div>
                  <h3>Email</h3>
                  <p>
                    <a href={`mailto:${business.email}`}>{business.email}</a>
                  </p>
                </div>
              </li>
              <li>
                <span className="icon-badge icon-badge-sm icon-badge-wa">
                  <Icon name="whatsapp" size={20} />
                </span>
                <div>
                  <h3>WhatsApp</h3>
                  <p>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      Chat with us on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </p>
                </div>
              </li>
            </ul>
            <div className="map">
              {/* TODO: confirm — replace with the exact Google Maps pin for the office. */}
              <iframe
                src={business.mapEmbedUrl}
                title="Map showing VSS office location in Joniawas, Farrukhnagar, Gurugram"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a className="text-link" href={business.mapLinkUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
              <Icon name="arrow-right" size={16} />
            </a>
          </div>
          <div className="reveal reveal-right" id="enquiry">
            {form ?? <ContactForm />}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Call-to-action band ---------- */
export function CtaBand({ title = "Need trained security staff for your site?", text }: { title?: string; text?: string }) {
  const [primary] = business.phones;
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container cta-inner reveal">
        <div>
          <h2 id="cta-title">{title}</h2>
          <p>{text ?? "Tell us about your site. We'll visit, plan the deployment and send a quote, with no obligation."}</p>
        </div>
        <div className="cta-actions">
          <Link href="/contact/#enquiry" className="btn btn-gold">
            Get a Free Quote
            <Icon name="arrow-right" size={18} />
          </Link>
          <a href={`tel:${primary.tel}`} className="btn btn-outline-light">
            <Icon name="phone" size={18} />
            {primary.display}
          </a>
        </div>
      </div>
    </section>
  );
}
