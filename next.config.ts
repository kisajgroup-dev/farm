import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Prisma's generated client and Vercel Linux query engine are part of
  // every server function trace, including server actions such as login.
  outputFileTracingIncludes: {
    "/**/*": ["./node_modules/.prisma/client/**/*"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
