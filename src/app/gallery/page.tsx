import { photos } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { Gallery } from "@/components/Gallery";
import { CtaBand, PageHero } from "@/components/sections";

export const metadata = pageMeta({
  title: "Gallery – VSS Security Guards on Duty in Haryana",
  description:
    "Photos of Vanshika Security Service guards, supervisors and housekeeping staff on duty at client sites across Gurugram and Haryana, plus our latest flyers.",
  path: "/gallery/",
  image: { url: "/images/photos/guards-night-lineup.webp", alt: "VSS security guards in black uniforms lined up at a site at night" },
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Gallery"
        tagline="Our guards and staff on duty at client sites, plus our latest flyers."
        image={photos.blackFive}
        crumbs={[{ href: "/gallery/", label: "Gallery" }]}
      />
      <section className="section" aria-label="Photo gallery">
        <div className="container">
          <Gallery />
        </div>
      </section>
      <CtaBand title="Want this team at your site?" />
    </>
  );
}
