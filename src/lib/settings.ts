import { getDb } from "@/lib/prisma";
import { cache } from "react";

const DEFAULT_SETTINGS = {
  id: "singleton",
  comingSoonMode: true,
  siteTitle: process.env.NEXT_PUBLIC_SITE_NAME || "GreenRoots Organic Farm",
  tagline: "Fresh organic vegetables, from our farm to your family.",
  description: "A small organic farm in Kalmunai, Sri Lanka.",
  logoUrl: null as string | null,
  backgroundUrl: null as string | null,
  launchDate: null as Date | null,
  whatsappNumber: "+94770000000",
  email: "hello@greenroots.lk",
  addressText: "Palamunai, Kalmunai, Sri Lanka",
  mapLat: 7.4167,
  mapLng: 81.8167,
  facebookUrl: null as string | null,
  instagramUrl: null as string | null,
  tiktokUrl: null as string | null,
  youtubeUrl: null as string | null,
  updatedAt: new Date(),
};

export type SiteSettings = typeof DEFAULT_SETTINGS;

/**
 * Read site settings. Falls back to safe defaults if the DB is
 * unreachable or not yet seeded, so the Coming Soon page always renders.
 */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const prisma = await getDb();
    const settings = await prisma.setting.findUnique({ where: { id: "singleton" } });
    if (!settings) return DEFAULT_SETTINGS;
    return settings as unknown as SiteSettings;
  } catch (err) {
    console.error("[settings] DB unavailable, using defaults:", err);
    return DEFAULT_SETTINGS;
  }
});
