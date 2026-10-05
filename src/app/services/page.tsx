import { photos } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { CtaBand, Industries, PageHero, Process, ServicesGrid, WhyUs } from "@/components/sections";

export const metadata = pageMeta({
  title: "Security Services in Gurugram – Guards, Bouncers, PSO, Manpower",
  description:
    "Security guards, supervisors, bouncers, PSO, gunman, event security, manpower, housekeeping & facility management and electro-mechanical services by VSS, Gurugram.",
  path: "/services/",
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
