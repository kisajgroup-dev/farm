import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OpenNext must bundle Prisma and its generated client for the workerd
  // runtime; leaving them external makes Prisma resolve the Node.js build.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
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
