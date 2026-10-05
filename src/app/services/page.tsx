import { photos } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { CtaBand, Industries, PageHero, Process, ServicesGrid, WhyUs } from "@/components/sections";

export const metadata = pageMeta({
  title: "Security Services in Gurugram & Haryana – Guards, Bouncers, PSO, Manpower",
  description:
    "Security guards, supervisors, bouncers, PSO, gunman, event security, manpower, housekeeping, facility management and electro-mechanical services by VSS, a PSARA licensed agency in Gurugram, Haryana.",
  path: "/services/",
  keywords: [
    "security services in Haryana",
    "security services Gurugram",
    "security guard services Gurgaon",
    "bouncer services Gurugram",
    "PSO services Haryana",
    "gunman services Gurugram",
    "event security Haryana",
    "manpower services Gurugram",
    "housekeeping and facility management Haryana",
  ],
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        tagline="Trained security and manpower for factories, warehouses, offices, societies, retail and events."
        image={photos.nightLineup}
        crumbs={[{ href: "/services/", label: "Services" }]}
      />
      <ServicesGrid />
      <Industries />
      <Process />
      <WhyUs />
      <CtaBand />
    </>
  );
}
