import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Workers doesn't run the default Next image optimizer, so serve
    // images as-is. (Fine for this site; uploads come from R2 via /api/files.)
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

// Enables Cloudflare bindings (D1, R2, secrets) while running `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
