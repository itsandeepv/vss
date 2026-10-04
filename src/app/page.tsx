import { about, business, clients, industries, md, nav, processSteps, psara, services, whatsappHref, whyUs } from "@/content/site";
import { Icon } from "@/components/Icon";
import { Header } from "@/components/Header";
import { HeroVideo } from "@/components/HeroVideo";
import { Gallery } from "@/components/Gallery";
import { Stats } from "@/components/Stats";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { Year } from "@/components/Year";

const BUILD_YEAR = new Date().getFullYear();
const [primaryPhone, helpline] = business.phones;

/** Shown wherever a fact is still missing from content.md. */
function Pending({ what }: { what: string }) {
  return (
    <span className="pending" title={`${what}: to be confirmed`}>
      To be confirmed
    </span>
  );
}

function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <ul className="topbar-contacts">
          {business.phones.map((p) => (
            <li key={p.tel}>
              <a href={`tel:${p.tel}`}>
                <Icon name="phone" size={15} />
                <span>
                  <span className="topbar-label">{p.label}: </span>
                  {p.display}
                </span>
              </a>
            </li>
          ))}
          <li className="topbar-email">
            <a href={`mailto:${business.email}`}>
              <Icon name="mail" size={15} />
              <span>{business.email}</span>
            </a>
          </li>
        </ul>
        <a href="#psara" className="psara-pill">
          <Icon name="badge" size={15} />
          PSARA Licensed
        </a>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroVideo />
      <div className="container">
        <div className="hero-content">
          <p className="eyebrow eyebrow-light hero-anim">{business.tagline}</p>
          <h1 id="hero-title" className="hero-anim">
            {business.name}
          </h1>
          <p className="hero-sub hero-anim">PSARA Licensed Security &amp; Manpower Solutions</p>
          <p className="hero-text hero-anim">{business.strapline}</p>
          <div className="hero-actions hero-anim">
            <a href="#contact" className="btn btn-gold">
              Request Free Consultation
              <Icon name="arrow-right" size={18} />
            </a>
            <a href={`tel:${primaryPhone.tel}`} className="btn btn-outline-light">
              <Icon name="phone" size={18} />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, text, id, light }: { eyebrow: string; title: string; text?: string; id: string; light?: boolean }) {
  return (
    <div className="section-head reveal">
      <p className={`eyebrow${light ? " eyebrow-light" : ""}`}>{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {text && <p className="section-text">{text}</p>}
    </div>
  );
}

function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="reveal reveal-left">
          <p className="eyebrow">About VSS</p>
          <h2 id="about-title">Security and facility management you can rely on, since 2016</h2>
          <p className="lead">{about.intro}</p>
          <p>{about.body}</p>
          <ul className="check-list">
            {about.points.map((p) => (
              <li key={p}>
                <Icon name="check" size={18} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <aside className="md-card reveal reveal-right" aria-labelledby="md-title">
          <div className="md-photo">
            {md.photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export
              <img src={md.photo} alt={`${md.name}, ${md.role}`} width={160} height={160} loading="lazy" />
            ) : (
              // TODO: confirm — MD photo not supplied yet (brochure: "Pic will be updated soon").
              <span className="md-initials" aria-hidden="true">
                LN
              </span>
            )}
          </div>
          <p className="md-kicker">Leadership</p>
          <h3 id="md-title">{md.name}</h3>
          <p className="md-role">{md.role} · Ex-Indian Army</p>
          <p>{md.summary}</p>
        </aside>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="section section-alt" aria-labelledby="why-title">
      <div className="container">
        <SectionHead
          id="why-title"
          eyebrow="Why choose us"
          title="Why organisations choose VSS"
          text="We are licensed and verified, our people are trained and supervised, and you get regular reports on every site."
        />
        <ul className="card-grid card-grid-4">
          {whyUs.map((w, i) => (
            <li key={w.title} className="feature-card reveal" style={{ "--i": i } as React.CSSProperties}>
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

function Services() {
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container">
        <SectionHead
          id="services-title"
          eyebrow="Our services"
          title="Security & manpower services"
          text="Manned guarding is our core, backed by facility management, housekeeping and technical support from one agency."
        />
        <ul className="card-grid card-grid-3">
          {services.map((s, i) => (
            <li key={s.id} className="service-card reveal" id={`service-${s.id}`} style={{ "--i": i % 3 } as React.CSSProperties}>
              <div className={`service-media${s.image ? "" : " service-media--art"}`}>
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export
                  <img
                    src={s.image.src.replace(/\.webp$/, "-800.webp")}
                    alt={s.image.alt}
                    width={800}
                    height={450}
                    style={s.image.position ? { objectPosition: s.image.position } : undefined}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  // TODO: confirm — real service photo pending; illustrated panel shown meanwhile.
                  <Icon name={s.icon} size={56} />
                )}
              </div>
              <div className="service-body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <a href="#contact" className="text-link">
                  Enquire<span className="sr-only"> about {s.title}</span>
                  <Icon name="arrow-right" size={16} />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Industries() {
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
          {industries.map((i, n) => (
            <li key={i.title} className="industry reveal reveal-zoom" style={{ "--i": n } as React.CSSProperties}>
              <Icon name={i.icon} size={30} />
              <span>{i.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Process() {
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
          {processSteps.map((p, i) => (
            <li key={p.title} className="step" style={{ "--i": i } as React.CSSProperties}>
              <span className="step-num" aria-hidden="true">
                {i + 1}
              </span>
              <h3>
                <span className="sr-only">Step {i + 1}: </span>
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

function Psara() {
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

function GallerySection() {
  return (
    <section id="gallery" className="section" aria-labelledby="gallery-title">
      <div className="container">
        <SectionHead
          id="gallery-title"
          eyebrow="Gallery"
          title="VSS on the ground"
          text="Our guards and staff at client sites, plus our latest flyers."
        />
        <div className="reveal">
          <Gallery />
        </div>
      </div>
    </section>
  );
}

function Clients() {
  // The list is rendered twice for a seamless loop; the copy is hidden from assistive tech.
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

function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <SectionHead
          id="contact-title"
          eyebrow="Contact us"
          title="Get a free security consultation"
          text="Tell us about your site and we will call you back with a plan and a quote."
        />
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
          <div className="reveal reveal-right">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <a href="#top" className="brand brand-footer" aria-label={`${business.name} — back to top`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
            <img
              src="/images/logo-96.webp"
              srcSet="/images/logo-96.webp 1x, /images/logo-192.webp 2x"
              width={48}
              height={58}
              alt=""
              loading="lazy"
            />
            <span className="brand-text">
              <span className="brand-name">Vanshika</span>
              <span className="brand-sub">Security Service</span>
            </span>
          </a>
          <p>
            PSARA-licensed security &amp; manpower agency in Farrukhnagar, Gurugram, providing trained, police-verified guards and facility
            staff across North India since 2016.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="footer-title">Quick Links</h2>
          <ul className="footer-links">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="footer-title">Services</h2>
          <ul className="footer-links">
            {services.slice(0, 6).map((s) => (
              <li key={s.id}>
                <a href={`#service-${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer-title">Contact</h2>
          <ul className="footer-contact">
            <li>
              <Icon name="pin" size={18} />
              <address>{business.address.full}</address>
            </li>
            <li>
              <Icon name="phone" size={18} />
              <span>
                <a href={`tel:${primaryPhone.tel}`}>{primaryPhone.display}</a>
                <br />
                <a href={`tel:${helpline.tel}`}>{helpline.display}</a>
              </span>
            </li>
            <li>
              <Icon name="mail" size={18} />
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>
            © <Year initial={BUILD_YEAR} /> Vanshika Security Service (VSS). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <div className="scroll-progress" aria-hidden="true" />
      <TopBar />
      <Header />
      <main id="main">
        <Hero />
        <section className="stats-strip" aria-label="VSS in numbers">
          <div className="container">
            <Stats buildYear={BUILD_YEAR} />
          </div>
        </section>
        <About />
        <WhyUs />
        <Services />
        <Industries />
        <Process />
        <Psara />
        <GallerySection />
        <Clients />
        <Contact />
      </main>
      <Footer />
      <a
        className="wa-float"
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with VSS on WhatsApp (opens in a new tab)"
      >
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3.2 28.8l7.1-1.8c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.7 12.7-12.7S23 3 16 3zm0 23.2c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.2 1.1 1.1-4.1-.3-.4a10.4 10.4 0 01-1.6-5.5C5.2 9.8 10 5.1 16 5.1s10.6 4.7 10.6 10.6S21.9 26.2 16 26.2zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.7-.4z"
          />
        </svg>
      </a>
      <Reveal />
    </>
  );
}
