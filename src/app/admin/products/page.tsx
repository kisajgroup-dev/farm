import { getDb } from "@/lib/prisma";
import { ProductManager } from "@/components/admin/product-manager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const prisma = await getDb();
  const [rows, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const products = rows.map((p) => ({
    id: p.id, name: p.name, description: p.description, imageUrl: p.imageUrl,
    price: Number(p.price), unit: p.unit, quantity: p.quantity,
    available: p.available, featured: p.featured,
    categoryId: p.categoryId, categoryName: p.category?.name ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Products</h1>
        <p className="mt-1 text-muted-foreground">Add and manage the vegetables you sell.</p>
      </div>
      <ProductManager products={products} categories={categories} />
    </div>
  );
}
