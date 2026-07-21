"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Sprout, Truck, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import type { SiteSettings } from "@/lib/settings";
import type { PublicProduct } from "@/types";

const HERO = "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1920&q=80";

export function HomePage({ settings, products }: { settings: SiteSettings; products: PublicProduct[] }) {
  const { t } = useLanguage();
  return (
    <>
      <Navbar settings={settings} />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[80vh] items-center overflow-hidden">
          <Image src={settings.backgroundUrl || HERO} alt="" fill priority className="object-cover" />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur">
                <Leaf className="h-3.5 w-3.5" /> 100% Organic
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">{settings.siteTitle}</h1>
              <p className="mt-4 text-lg text-white/90">{settings.tagline}</p>
              <div className="mt-8 flex gap-3">
                <Button asChild size="lg"><Link href="/products">{t.nav.shopNow} <ArrowRight className="h-4 w-4" /></Link></Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                  <Link href="/about">{t.nav.about}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Value props */}
        <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 sm:grid-cols-3">
          {[
            { Icon: Sprout, title: "Grown naturally", body: "No harmful chemicals — just healthy soil, sun and care." },
            { Icon: Leaf, title: "Freshly harvested", body: "Picked to order from our rooftop garden and Palamunai farm." },
            { Icon: Truck, title: "Direct to you", body: "Order on WhatsApp and get it delivered fresh to your family." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>

        {/* Featured products */}
        {products.length > 0 && (
          <section className="mx-auto max-w-6xl px-5 py-12">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold">Latest harvest</h2>
                <p className="mt-1 text-muted-foreground">Fresh picks available now.</p>
              </div>
              <Link href="/products" className="hidden text-sm text-primary hover:underline sm:block">View all →</Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {products.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} whatsappNumber={settings.whatsappNumber} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer settings={settings} />
    </>
  );
}
