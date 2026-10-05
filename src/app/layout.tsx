import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { SITE_URL, business, psara } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { Header } from "@/components/Header";
import { Footer, TopBar, WhatsAppFloat } from "@/components/Chrome";
import { Reveal } from "@/components/Reveal";
import "./globals.css";

// Self-hosted at build time by next/font — no request to Google from visitors' browsers.
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-heading", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const title = "Security Guard Services in Gurugram | PSARA Security Agency Haryana – VSS";
const description =
  "Vanshika Security Service (VSS) is a PSARA licensed security agency in Farrukhnagar, Gurugram. Police-verified security guards, supervisors, bouncers, PSO, event security, housekeeping & manpower across Haryana and Delhi NCR. 24×7 QRT.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta({ title, description, path: "/", absoluteTitle: true }),
  title: { default: title, template: `%s | ${business.name}` },
  keywords: [
    "security guard services Gurugram",
    "security agency Farrukhnagar",
    "PSARA security agency Haryana",
    "security services Gurgaon",
    "manpower agency Gurugram",
    "bouncer services Gurugram",
    "housekeeping services Gurugram",
  ],
  applicationName: business.name,
  formatDetection: { telephone: false },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b1324",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  // schema.org has no "SecurityService" type; LocalBusiness + ProfessionalService is the closest valid match.
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${SITE_URL}/#business`,
  name: business.legalName,
  alternateName: business.shortName,
  slogan: business.tagline,
  description,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-512.png`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: business.phones.map((p) => p.tel),
  email: business.email,
  foundingDate: String(business.foundedYear),
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.locality,
    addressRegion: business.address.region,
    postalCode: business.address.postalCode,
    addressCountry: business.address.country,
  },
  areaServed: business.areaServed.map((name) => ({ "@type": "Place", name })),
  founder: { "@type": "Person", name: "Capt. Laxmi Narain", jobTitle: "Managing Director" },
  knowsAbout: ["Security guard services", "Manpower services", "Facility management", "Housekeeping", "Event security"],
  ...(psara.licenceNo ? { hasCredential: { "@type": "EducationalOccupationalCredential", name: `PSARA Licence ${psara.licenceNo}` } } : {}),
  ...(business.social.length ? { sameAs: business.social.map((s) => s.url) } : {}),
  contactPoint: business.phones.map((p) => ({
    "@type": "ContactPoint",
    telephone: p.tel,
    contactType: p.label === "Sales" ? "sales" : "customer support",
    areaServed: "IN",
    availableLanguage: ["en", "hi"],
  })),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="scroll-progress" aria-hidden="true" />
        <TopBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <Reveal />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
