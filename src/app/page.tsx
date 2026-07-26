import { getSettings } from "@/lib/settings";
import { getDb } from "@/lib/prisma";
import { ComingSoonPage } from "@/components/coming-soon/coming-soon-page";
import { HomePage } from "@/components/site/home-page";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const settings = await getSettings();
  const prisma = await getDb();

  // Featured products (safe if DB is empty/unavailable)
  let featured: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  try {
    featured = await prisma.product.findMany({
      where: { featured: true, available: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    featured = [];
  }

  const products = featured.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    unit: p.unit,
    quantity: p.quantity,
    available: p.available,
    imageUrl: p.imageUrl,
    description: p.description,
  }));

  // ============ WEBSITE MODE CONTROL ============
  // if comingSoonMode === true  -> show ComingSoonPage
  // else                        -> show FullWebsite (home)
  if (settings.comingSoonMode) {
    return <ComingSoonPage settings={settings} products={products} />;
  }
  return <HomePage settings={settings} products={products} />;
}
