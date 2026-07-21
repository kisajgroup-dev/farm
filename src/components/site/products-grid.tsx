"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/product-card";
import { cn } from "@/lib/utils";
import type { PublicProduct } from "@/types";

type P = PublicProduct & { category: string | null };

export function ProductsGrid({ products, whatsappNumber }: { products: P[]; whatsappNumber: string }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [products]);
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              active === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-accent"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No products in this category yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
          ))}
        </div>
      )}
    </>
  );
}
