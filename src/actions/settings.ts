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

export async function getAdminUsers() {
  await requireAdmin();
  const prisma = await getDb();
  return prisma.admin.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAdminUser(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const email = (formData.get("username") as string | null)?.trim();
  const name = (formData.get("name") as string | null)?.trim() || "Farm Admin";
  const password = (formData.get("password") as string | null)?.trim();
  const role = (formData.get("role") as string | null) || "ADMIN";

  if (!email || !password) {
    return { ok: false, error: "Username and Password are required." };
  }

  try {
    const bcrypt = (await import("bcryptjs")).default;
    const prisma = await getDb();
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return { ok: false, error: `Username '${email}' already exists.` };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: { email, name, passwordHash, role },
    });
    revalidatePath("/admin/settings");
    return { ok: true, error: null };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Could not create admin user." };
  }
}

export async function resetAdminPassword(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const email = (formData.get("username") as string | null)?.trim();
  const newPassword = (formData.get("newPassword") as string | null)?.trim();

  if (!email || !newPassword) {
    return { ok: false, error: "Username and New Password are required." };
  }

  try {
    const bcrypt = (await import("bcryptjs")).default;
    const prisma = await getDb();
    const user = await prisma.admin.findUnique({ where: { email } });
    if (!user) {
      return { ok: false, error: `User '${email}' not found.` };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { email },
      data: { passwordHash },
    });
    revalidatePath("/admin/settings");
    return { ok: true, error: null };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Could not reset password." };
  }
}

export async function deleteAdminUser(id: string) {
  const session = await requireAdmin();
  if (session.sub === id) {
    return { ok: false, error: "You cannot delete your own logged-in user account." };
  }
  try {
    const prisma = await getDb();
    await prisma.admin.delete({ where: { id } });
    revalidatePath("/admin/settings");
    return { ok: true, error: null };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Could not delete user." };
  }
}
