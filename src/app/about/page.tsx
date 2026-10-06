import Link from "next/link";
import { photos, serviceHref, services } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { Icon } from "@/components/Icon";
import { AboutSplit, CtaBand, MdFeature, PageHero, Psara, SectionHead, StatsStrip, TeamGrid, WhyUs } from "@/components/sections";

export const metadata = pageMeta({
  title: "About Us – PSARA Licensed Security Agency in Gurugram, Haryana",
  description:
    "Vanshika Security Service (VSS), established in 2025 and led by Capt. Laxmi Narain (32 years, Indian Army). 500+ trained manpower serving clients including Alexis Global, First Choice Express, Supreme SCS and Glenmark.",
  path: "/about/",
  keywords: [
    "PSARA licensed security agency Haryana",
    "ex-army security agency Gurugram",
    "trusted security company Haryana",
    "Vanshika Security Service",
    "Capt. Laxmi Narain",
  ],
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Vanshika Security Service"
        tagline="A growing security and facility management agency, established in 2025 in Farrukhnagar, Gurugram."
        image={photos.independenceDay}
        crumbs={[{ href: "/about/", label: "About" }]}
      />
      <AboutSplit full />
      <StatsStrip />
      <MdFeature />
      <section className="section" aria-labelledby="deal-title">
        <div className="container">
          <SectionHead
            id="deal-title"
            eyebrow="What we do"
            title="One agency for security, manpower and facilities"
            text="Manned guarding is our core. Around it we provide manpower, housekeeping, property and technical services, so you can manage your site through a single window."
          />
          <ul className="pill-grid">
            {services.map((s, n) => (
              <li key={s.id} className="reveal" style={{ "--i": n } as React.CSSProperties}>
                <Link href={serviceHref(s.id)} className="pill-link">
                  <Icon name={s.icon} size={22} />
                  <span>{s.title}</span>
                  <Icon name="arrow-right" size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <WhyUs />
      <TeamGrid />
      <Psara />
      <CtaBand />
    </>
  );
}
