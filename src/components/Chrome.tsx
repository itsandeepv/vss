import Link from "next/link";
import { business, nav, serviceHref, services, whatsappHref } from "@/content/site";
import { Icon } from "./Icon";
import { Year } from "./Year";

/** Site-wide chrome rendered by the root layout on every page. */

const BUILD_YEAR = new Date().getFullYear();

export function TopBar() {
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
        <Link href="/#psara" className="psara-pill">
          <Icon name="badge" size={15} />
          PSARA Licensed
        </Link>
      </div>
    </div>
  );
}

export function Footer() {
  const [primaryPhone] = business.phones;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <Link href="/" className="brand brand-footer" aria-label={`${business.name} home`}>
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
          </Link>
          <p>
            PSARA-licensed security &amp; manpower agency in Farrukhnagar, Gurugram, providing trained, police-verified guards and facility
            staff across Haryana and Delhi NCR. Established 2025.
          </p>
          <a className="footer-wa" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={18} />
            Chat on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <nav aria-label="Footer">
          <h2 className="footer-title">Quick Links</h2>
          <ul className="footer-links">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/credits/">Image Credits</Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="footer-title">Services</h2>
          <ul className="footer-links">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={serviceHref(s.id)}>{s.title}</Link>
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
        <div className="container footer-bottom-inner">
          <p>
            © <Year initial={BUILD_YEAR} /> Vanshika Security Service (VSS). All rights reserved.
          </p>
          <p className="footer-tagline">{business.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
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
  );
}
