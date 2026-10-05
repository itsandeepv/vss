import type { Metadata } from "next";
import { business } from "@/content/site";

const defaultImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Vanshika Security Service (VSS) — PSARA licensed security & manpower agency in Gurugram, Haryana",
};

/**
 * Per-page metadata. Next merges `openGraph`/`twitter` shallowly (a page's object replaces the
 * layout's), so every page builds the full set here to keep the share image and site name.
 */
export function pageMeta({
  title,
  description,
  path,
  absoluteTitle,
  keywords,
  image,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  keywords?: string[];
  /** Page-specific share image (site-relative); falls back to the default OG image. */
  image?: { url: string; alt: string };
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${business.name}`;
  const images = image ? [image, defaultImage] : [defaultImage];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: business.legalName,
      title: fullTitle,
      description,
      locale: "en_IN",
      images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: images.map((i) => i.url) },
  };
}
