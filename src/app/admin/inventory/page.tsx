import { prisma } from "@/lib/prisma";
import { InventoryManager } from "@/components/admin/inventory-manager";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const rows = await prisma.product.findMany({ orderBy: { name: "asc" } });
  const products = rows.map((p) => ({
    id: p.id, name: p.name, unit: p.unit, quantity: p.quantity, available: p.available,
  }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Inventory</h1>
        <p className="mt-1 text-muted-foreground">Update stock levels and availability.</p>
      </div>
      <InventoryManager products={products} />
    </div>
  );
}
