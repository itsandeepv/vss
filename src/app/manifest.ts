import type { MetadataRoute } from "next";
import { business } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.legalName,
    short_name: business.shortName,
    description: "PSARA licensed security guard, bouncer, PSO and manpower services in Gurugram, Haryana and Delhi NCR.",
    lang: "en-IN",
    categories: ["business"],
    start_url: "/",
    display: "browser",
    background_color: "#0b1324",
    theme_color: "#0b1324",
    icons: [
      { src: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
