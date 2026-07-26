"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function toggleComingSoon(next: boolean) {
  await requireAdmin();
  const prisma = await getDb();
  await prisma.setting.upsert({
    where: { id: "singleton" },
    update: { comingSoonMode: next },
    create: { id: "singleton", comingSoonMode: next },
  });
  revalidatePath("/", "layout");
  return { ok: true, comingSoonMode: next };
}

export async function updateSettings(_prev: unknown, formData: FormData) {
  await requireAdmin();

  const str = (k: string) => (formData.get(k) as string | null)?.trim() || null;
  const req = (k: string, fallback: string) => str(k) ?? fallback;
  const num = (k: string, fallback: number) => {
    const v = parseFloat((formData.get(k) as string) ?? "");
    return isNaN(v) ? fallback : v;
  };
  const launchRaw = str("launchDate");

  try {
    const prisma = await getDb();
    await prisma.setting.upsert({
      where: { id: "singleton" },
      update: {
        siteTitle: req("siteTitle", "GreenRoots Organic Farm"),
        tagline: req("tagline", ""),
        description: req("description", ""),
        logoUrl: str("logoUrl"),
        backgroundUrl: str("backgroundUrl"),
        launchDate: launchRaw ? new Date(launchRaw) : null,
        whatsappNumber: req("whatsappNumber", ""),
        email: req("email", ""),
        addressText: req("addressText", ""),
        mapLat: num("mapLat", 7.4167),
        mapLng: num("mapLng", 81.8167),
        facebookUrl: str("facebookUrl"),
        instagramUrl: str("instagramUrl"),
        tiktokUrl: str("tiktokUrl"),
        youtubeUrl: str("youtubeUrl"),
      },
      create: {
        id: "singleton",
        siteTitle: req("siteTitle", "GreenRoots Organic Farm"),
        tagline: req("tagline", ""),
        whatsappNumber: req("whatsappNumber", "+94770000000"),
      },
    });
    revalidatePath("/", "layout");
    return { ok: true, error: null };
  } catch {
    return { ok: false, error: "Could not save settings." };
  }
}
