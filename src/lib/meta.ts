import type { Metadata } from "next";
import { business } from "@/content/site";

/**
 * Per-page metadata. Next merges `openGraph`/`twitter` shallowly (a page's object replaces the
 * layout's), so every page builds the full set here to keep the share image and site name.
 */
export function pageMeta({
  title,
  description,
  path,
  absoluteTitle,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${business.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: business.legalName,
      title: fullTitle,
      description,
      locale: "en_IN",
      images: [
        { url: "/og-image.jpg", width: 1200, height: 630, alt: "Vanshika Security Service (VSS) — PSARA licensed security & manpower" },
      ],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: ["/og-image.jpg"] },
  };
}
