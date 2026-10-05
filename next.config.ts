import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  // Runs as a small Node.js server (needed for SMTP in /api/enquiry). Pages are still prerendered
  // at build time. `standalone` produces .next/standalone/server.js — see README → Deployment.
  output: "standalone",
  // Images are pre-optimised to WebP by `npm run images`, so no runtime optimiser is needed.
  images: { unoptimized: true },
  // /about → /about/ (consistent canonical URLs).
  trailingSlash: true,
  poweredByHeader: false,
  // One canonical host: www.vanshikasecurity.com → vanshikasecurity.com.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.vanshikasecurity.com" }],
        destination: "https://vanshikasecurity.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
      { source: "/video/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
      { source: "/og-image.jpg", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
    ];
  },
};

export default nextConfig;
