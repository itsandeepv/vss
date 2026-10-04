import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found – Vanshika Security Service",
  robots: { index: false, follow: true },
};

/** Exported as out/404.html; .htaccess serves it for unknown URLs. */
export default function NotFound() {
  return (
    <main className="notfound">
      <div className="notfound-card">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
        <img src="/images/logo-192.webp" width={96} height={115} alt="Vanshika Security Service logo" />
        <p className="eyebrow eyebrow-light">Error 404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for doesn&apos;t exist or has moved.</p>
        <div className="hero-actions">
          <Link href="/" className="btn btn-gold">
            Back to home
          </Link>
          <a href={`tel:${business.phones[0].tel}`} className="btn btn-outline-light">
            Call {business.phones[0].display}
          </a>
        </div>
      </div>
    </main>
  );
}
