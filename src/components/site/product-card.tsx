"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { formatLKR, UNIT_LABEL } from "@/lib/utils";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import type { PublicProduct } from "@/types";

const FALLBACK = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80";

export function ProductCard({ product, whatsappNumber }: { product: PublicProduct; whatsappNumber: string }) {
  const { t } = useLanguage();
  const [qty, setQty] = useState(1);
  const inStock = product.available && product.quantity > 0;
  const unit = UNIT_LABEL[product.unit] ?? product.unit;

  const orderLink = buildWhatsAppOrderLink(
    whatsappNumber,
    [{ name: product.name, quantity: qty, unit: product.unit }]
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.imageUrl || FALLBACK}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          {inStock ? (
            <Badge variant="success">{t.product.inStock}</Badge>
          ) : (
            <Badge variant="destructive">{t.product.outOfStock}</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-medium">{product.name}</h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        )}
        <p className="mt-2 text-primary">
          <span className="text-lg font-semibold">{formatLKR(product.price)}</span>
          <span className="text-sm text-muted-foreground"> / {unit}</span>
        </p>

        {inStock && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground" aria-label="Decrease">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground" aria-label="Increase">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
        )}

        <div className="mt-4 flex-1" />
        <Button asChild variant="whatsapp" className="w-full" disabled={!inStock}>
          <a href={inStock ? orderLink : undefined} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" /> {t.product.order}
          </a>
        </Button>
      </div>
    </div>
  );
}
