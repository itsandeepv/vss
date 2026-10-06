import type { MetadataRoute } from "next";
import { SITE_URL, gallery, photos, serviceHref, services } from "@/content/site";

export const dynamic = "force-static";

const abs = (path: string) => `${SITE_URL}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    images: string[] = [],
  ): MetadataRoute.Sitemap[number] => ({
    url: abs(path),
    lastModified: now,
    changeFrequency,
    priority,
    ...(images.length ? { images: images.map(abs) } : {}),
  });
  return [
    page("/", 1, "weekly", ["/og-image.jpg", photos.nightLineup.src, photos.gate.src, photos.warehouseTeam.src]),
    page("/services/", 0.9, "monthly"),
    ...services.map((s) => {
      const img = s.banner ?? s.image;
      return page(serviceHref(s.id), 0.9, "monthly", img ? [img.src] : []);
    }),
    page("/about/", 0.7, "monthly", [photos.independenceDay.src]),
    page("/contact/", 0.8, "yearly"),
    page(
      "/gallery/",
      0.6,
      "monthly",
      gallery.map((g) => g.full),
    ),
  ];
}
