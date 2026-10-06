import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { SITE_URL, business, gallery, md, psara, serviceHref, services } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { Header } from "@/components/Header";
import { Footer, TopBar, WhatsAppFloat } from "@/components/Chrome";
import { Reveal } from "@/components/Reveal";
import "./globals.css";

// Self-hosted at build time by next/font — no request to Google from visitors' browsers.
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-heading", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const title = "Security Guard Services in Gurugram, Haryana | PSARA Agency – VSS";
const description =
  "PSARA licensed security agency in Gurugram, Haryana. Police-verified security guards, supervisors, bouncers, PSO, gunman, event security, housekeeping & manpower across Haryana and Delhi NCR. 24×7 QRT. Free site survey.";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta({ title, description, path: "/", absoluteTitle: true }),
  title: { default: title, template: `%s | ${business.name}` },
  keywords: [
    "security agency in Haryana",
    "best security services in Haryana",
    "security guard services Gurugram",
    "security agency Gurgaon",
    "PSARA licensed security agency Haryana",
    "security company in Gurugram",
    "security guard agency near me",
    "security services Farrukhnagar",
    "security agency Pataudi",
    "security guards Manesar",
    "security services Rewari",
    "security agency Jhajjar",
    "security agency Bahadurgarh",
    "security services Faridabad",
    "security guard services Delhi NCR",
    "bouncer services Gurugram",
    "PSO services Haryana",
    "gunman services Gurugram",
    "event security Gurugram",
    "manpower agency Gurugram",
    "manpower supply Haryana",
    "housekeeping services Gurugram",
    "facility management Haryana",
    "industrial security Manesar",
    "warehouse security guards Haryana",
    "society security guards Gurugram",
    "Vanshika Security Service",
    "VSS security",
  ],
  applicationName: business.name,
  authors: [{ name: business.legalName, url: SITE_URL }],
  creator: business.legalName,
  publisher: business.legalName,
  category: "Security Services",
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  ...(googleVerification || bingVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
        },
      }
    : {}),
  other: {
    "geo.region": "IN-HR",
    "geo.placename": `${business.address.locality}, ${business.address.district}, ${business.address.region}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1324",
  width: "device-width",
  initialScale: 1,
};

const place = (name: string) =>
  name === "Haryana" ? { "@type": "State", name } : { "@type": "City", name, containedInPlace: { "@type": "State", name: "Haryana" } };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // schema.org has no "SecurityService" type; LocalBusiness + ProfessionalService is the closest valid match.
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `${SITE_URL}/#business`,
      name: business.legalName,
      alternateName: [business.name, business.shortName, "VSS Security"],
      slogan: business.tagline,
      description,
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo-512.png`, width: 512, height: 512 },
      image: [`${SITE_URL}/og-image.jpg`, ...gallery.filter((g) => g.kind === "team").map((g) => `${SITE_URL}${g.full}`)],
      telephone: business.phones[0].tel,
      email: business.email,
      foundingDate: String(business.foundedYear),
      numberOfEmployees: { "@type": "QuantitativeValue", minValue: 500 },
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address.street,
        addressLocality: business.address.locality,
        addressRegion: business.address.region,
        postalCode: business.address.postalCode,
        addressCountry: business.address.country,
      },
      hasMap: business.mapLinkUrl,
      // 24×7 Quick Response Team.
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
      areaServed: [...new Set([...business.seoCities, "Haryana"])].map((name) =>
        name === "Delhi NCR" ? { "@type": "Place", name } : place(name),
      ),
      founder: { "@type": "Person", name: md.name, jobTitle: md.role },
      knowsAbout: [
        "Security guard services",
        "Manned guarding",
        "Bouncer services",
        "Personal security officers",
        "Event security",
        "Manpower services",
        "Facility management",
        "Housekeeping",
        "Fire safety",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Security & manpower services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${SITE_URL}${serviceHref(s.id)}#service`,
            name: s.title,
            url: `${SITE_URL}${serviceHref(s.id)}`,
          },
        })),
      },
      ...(psara.licenceNo
        ? { hasCredential: { "@type": "EducationalOccupationalCredential", name: `PSARA Licence ${psara.licenceNo}` } }
        : {}),
      ...(business.social.length ? { sameAs: business.social.map((s) => s.url) } : {}),
      contactPoint: business.phones.map((p) => ({
        "@type": "ContactPoint",
        telephone: p.tel,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: business.name,
      alternateName: business.shortName,
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
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
