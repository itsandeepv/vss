import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export → `npm run build` writes the deployable site to /out.
  output: "export",
  // Images are pre-optimised to WebP by `npm run images`, so no runtime optimiser is needed.
  images: { unoptimized: true },
  // Emit /404.html and keep URLs as plain files (works on any Apache/cPanel host).
  trailingSlash: false,
  poweredByHeader: false,
};

export default nextConfig;
