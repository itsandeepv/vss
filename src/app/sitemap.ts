import type { MetadataRoute } from "next";
import { SITE_URL, serviceHref, services } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  });
  return [
    page("/", 1),
    page("/services/", 0.9),
    ...services.map((s) => page(serviceHref(s.id), 0.8)),
    page("/about/", 0.7),
    page("/contact/", 0.7),
    page("/gallery/", 0.5),
  ];
}
