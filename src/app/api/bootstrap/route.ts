import { NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "nodejs";

// One-time database seeding for Cloudflare D1.
// Call once after deploy:  https://<your-site>/api/bootstrap?token=YOUR_BOOTSTRAP_TOKEN
// Idempotent: safe to run more than once. Rotate/remove the token afterwards.
export async function GET(request: Request) {
  const { env } = await getCloudflareContext<CloudflareEnv>({ async: true });

  const token = new URL(request.url).searchParams.get("token");
  if (!token || token !== env.BOOTSTRAP_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = await getDb();
  const email = env.ADMIN_EMAIL || "admin";
  const password = env.ADMIN_PASSWORD || "Kindred123";
  const name = env.ADMIN_NAME || "Farm Admin";
  const passwordHash = await hashPassword(password);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, name, passwordHash, role: "SUPERADMIN" },
  });

  await prisma.setting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      comingSoonMode: true,
      launchDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      whatsappNumber: "+94770000000",
      addressText: "Palamunai, Kalmunai, Sri Lanka",
      mapLat: 7.4167,
      mapLng: 81.8167,
    },
  });

  const veg = await prisma.category.upsert({
    where: { slug: "vegetables" },
    update: {},
    create: { name: "Vegetables", slug: "vegetables", description: "Fresh organic vegetables" },
  });
  const leafy = await prisma.category.upsert({
    where: { slug: "leafy-greens" },
    update: {},
    create: { name: "Leafy Greens", slug: "leafy-greens", description: "Fresh greens & herbs" },
  });

  const products = [
    { name: "Fresh Tomato", slug: "fresh-tomato", price: 320, unit: "KG", quantity: 25, categoryId: veg.id, featured: true, imageUrl: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800" },
    { name: "Green Chilli", slug: "green-chilli", price: 450, unit: "KG", quantity: 12, categoryId: veg.id, imageUrl: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=800" },
    { name: "Brinjal (Eggplant)", slug: "brinjal", price: 260, unit: "KG", quantity: 18, categoryId: veg.id, featured: true, imageUrl: "https://images.unsplash.com/photo-1659261200833-ec8761558af7?w=800" },
    { name: "Spinach Bunch", slug: "spinach", price: 120, unit: "BUNCH", quantity: 30, categoryId: leafy.id, imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800" },
    { name: "Curry Leaves", slug: "curry-leaves", price: 80, unit: "PACK", quantity: 40, categoryId: leafy.id, featured: true, imageUrl: "https://images.unsplash.com/photo-1600231915711-4a1a3f0f7d34?w=800" },
    { name: "Okra (Ladies Finger)", slug: "okra", price: 300, unit: "KG", quantity: 15, categoryId: veg.id, imageUrl: "https://images.unsplash.com/photo-1664289295121-3f68e9e9d34c?w=800" },
  ];
  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  const gallery = [
    { title: "Rooftop garden beds", imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800", category: "rooftop", sortOrder: 1 },
    { title: "Preparing the Palamunai land", imageUrl: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800", category: "farm", sortOrder: 2 },
    { title: "First harvest", imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800", category: "harvest", sortOrder: 3 },
  ];
  for (const g of gallery) {
    const exists = await prisma.galleryImage.findFirst({ where: { imageUrl: g.imageUrl } });
    if (!exists) await prisma.galleryImage.create({ data: g });
  }

  const slug = "welcome-to-greenroots";
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) {
    await prisma.blogPost.create({
      data: {
        title: "Welcome to GreenRoots",
        slug,
        excerpt: "We're preparing our rooftop garden and the Palamunai farm. Here's what's coming.",
        content:
          "We are a small family organic farm in Kalmunai. Right now we're building our rooftop garden at home and preparing a small plot of land in Palamunai for vegetable farming.\n\nOur promise is simple: fresh vegetables, grown naturally, delivered straight to your family. Follow along as we grow!",
        coverUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200",
        published: true,
        publishedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ ok: true, message: "Database seeded. Log in at /admin with your admin credentials." });
}
