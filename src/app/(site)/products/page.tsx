import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { ProductsGrid } from "@/components/site/products-grid";
import type { PublicProduct } from "@/types";

export const metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const settings = await getSettings();
  const rows = await prisma.product.findMany({
    where: { available: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    include: { category: true },
  });

  const products: (PublicProduct & { category: string | null })[] = rows.map((p) => ({
    id: p.id, name: p.name, slug: p.slug, price: Number(p.price), unit: p.unit,
    quantity: p.quantity, available: p.available, imageUrl: p.imageUrl,
    description: p.description, category: p.category?.name ?? null,
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl font-semibold">Our Products</h1>
      <p className="mt-2 text-muted-foreground">Fresh, organically grown — order what you need on WhatsApp.</p>
      <ProductsGrid products={products} whatsappNumber={settings.whatsappNumber} />
    </div>
  );
}
