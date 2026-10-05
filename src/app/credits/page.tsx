import { imageCredits, photos } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { PageHero } from "@/components/sections";

export const metadata = {
  ...pageMeta({
    title: "Image Credits",
    description: "Credits and licences for free-licence images used on the VSS website.",
    path: "/credits/",
  }),
  robots: { index: false, follow: true },
};

export default function CreditsPage() {
  return (
    <>
      <PageHero title="Image Credits" image={photos.warehouseLineup} crumbs={[{ href: "/credits/", label: "Image Credits" }]} />
      <section className="section" aria-label="Image credits">
        <div className="container prose">
          <p>
            Photos of guards and staff on this website are of the VSS team. Where we don&apos;t yet have our own photo (for example industry
            examples and some services), we use the following free-licence images from Wikimedia Commons. They show general scenes and are
            not photos of VSS staff or client sites.
          </p>
          <ul className="credit-list">
            {Object.entries(imageCredits).map(([key, c]) => (
              <li key={key}>
                <a href={c.source} target="_blank" rel="noopener noreferrer">
                  {c.title}
                </a>{" "}
                by {c.author}, licensed{" "}
                {c.licenseUrl ? (
                  <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">
                    {c.license}
                  </a>
                ) : (
                  c.license
                )}
                . Resized and cropped for this website.
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
