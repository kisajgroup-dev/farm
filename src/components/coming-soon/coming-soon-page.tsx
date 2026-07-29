"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sprout, Building2, Leaf, MapPin, MessageCircle,
  Facebook, Instagram, Youtube, ArrowDown, Sun, HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { Countdown } from "@/components/coming-soon/countdown";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsAppContactLink } from "@/lib/whatsapp";
import { formatLKR, UNIT_LABEL } from "@/lib/utils";
import type { SiteSettings } from "@/lib/settings";
import type { PublicProduct } from "@/types";

const HERO_FALLBACK =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Section({
  children, id, className = "",
}: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fade}
      className={`mx-auto w-full max-w-6xl px-5 py-16 sm:py-24 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function ComingSoonPage({
  settings, products,
}: { settings: SiteSettings; products: PublicProduct[] }) {
  const { t } = useLanguage();
  const wa = buildWhatsAppContactLink(
    settings.whatsappNumber,
    "Hello! I'd love to be notified when the farm launches."
  );
  const bg = settings.backgroundUrl || HERO_FALLBACK;
  const mapSrc = `https://maps.google.com/maps?q=${settings.mapLat},${settings.mapLng}&z=13&output=embed`;

  const socials = [
    { url: settings.facebookUrl, Icon: Facebook, label: "Facebook" },
    { url: settings.instagramUrl, Icon: Instagram, label: "Instagram" },
    { url: settings.youtubeUrl, Icon: Youtube, label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <main className="min-h-screen bg-background">
      {/* ---------------- HERO ---------------- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
        <Image src={bg} alt="" fill priority className="object-cover" />
        <div className="hero-overlay absolute inset-0" />

        <div className="absolute right-5 top-5 z-20">
          <LanguageSwitcher />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-white/20 p-3 backdrop-blur-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.logoUrl || "/logo.png"} alt="logo" className="h-16 w-16 rounded-full object-contain" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md"
          >
            <Leaf className="h-3.5 w-3.5" /> {t.comingSoon.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="font-display text-4xl font-semibold leading-tight text-white sm:text-6xl md:text-7xl"
          >
            {settings.siteTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-5 max-w-2xl text-lg text-white/90 sm:text-xl"
          >
            {t.comingSoon.heroTitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-2 max-w-xl text-sm text-white/70 sm:text-base"
          >
            {t.comingSoon.heroSubtitle}
          </motion.p>

          {settings.launchDate && (
            <div className="mt-10">
              <p className="mb-4 text-xs uppercase tracking-widest text-white/70">{t.comingSoon.launchIn}</p>
              <Countdown launchDate={settings.launchDate ? new Date(settings.launchDate).toISOString() : null} />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10"
          >
            <Button asChild variant="whatsapp" size="lg">
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> {t.comingSoon.notify}
              </a>
            </Button>
          </motion.div>
        </div>

        <a href="#story" className="absolute bottom-8 z-10 text-white/70 transition-colors hover:text-white" aria-label="Scroll down">
          <ArrowDown className="h-6 w-6 animate-bounce" />
        </a>
      </section>

      {/* ---------------- STORY ---------------- */}
      <Section id="story">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <SectionLabel icon={<HeartHandshake className="h-4 w-4" />} text={t.comingSoon.storyTitle} />
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{t.comingSoon.storyTitle}</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{t.comingSoon.storyBody}</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1000&q=80" alt="Farm" fill className="object-cover" />
          </div>
        </div>
      </Section>

      {/* ---------------- VISION ---------------- */}
      <Section id="vision" className="rounded-[2.5rem] bg-secondary/60">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel icon={<Sun className="h-4 w-4" />} text={t.comingSoon.visionTitle} center />
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{t.comingSoon.visionTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed text-secondary-foreground/80">{t.comingSoon.visionBody}</p>
        </div>
      </Section>

      {/* ---------------- ROOFTOP + FARM ---------------- */}
      <Section id="projects">
        <div className="grid gap-6 md:grid-cols-2">
          <ProjectCard
            icon={<Building2 className="h-6 w-6" />}
            title={t.comingSoon.rooftopTitle}
            body={t.comingSoon.rooftopBody}
            image="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=1000&q=80"
          />
          <ProjectCard
            icon={<Sprout className="h-6 w-6" />}
            title={t.comingSoon.farmTitle}
            body={t.comingSoon.farmBody}
            image="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1000&q=80"
          />
        </div>
      </Section>

      {/* ---------------- FUTURE PRODUCTS ---------------- */}
      <Section id="products">
        <div className="text-center">
          <SectionLabel icon={<Leaf className="h-4 w-4" />} text={t.comingSoon.productsTitle} center />
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{t.comingSoon.productsTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t.comingSoon.productsBody}</p>
        </div>
        {products.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={p.imageUrl || HERO_FALLBACK}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="mt-1 text-sm text-primary">
                    {formatLKR(p.price)} <span className="text-muted-foreground">/ {UNIT_LABEL[p.unit] ?? p.unit}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      {/* ---------------- CONTACT ---------------- */}
      <Section id="contact" className="rounded-[2.5rem] bg-primary text-primary-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <MessageCircle className="mx-auto h-10 w-10" />
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">{t.comingSoon.contactTitle}</h2>
          <p className="mt-3 text-primary-foreground/80">{t.comingSoon.contactBody}</p>
          <div className="mt-8">
            <Button asChild variant="whatsapp" size="lg">
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> {settings.whatsappNumber}
              </a>
            </Button>
          </div>
        </div>
      </Section>

      {/* ---------------- LOCATION MAP ---------------- */}
      <Section id="location">
        <div className="text-center">
          <SectionLabel icon={<MapPin className="h-4 w-4" />} text={t.comingSoon.locationTitle} center />
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{t.comingSoon.locationTitle}</h2>
          <p className="mt-2 text-muted-foreground">{settings.addressText}</p>
        </div>
        <div className="mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-border">
          <iframe
            src={mapSrc}
            title="Farm location"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-12 text-center">
          {socials.length > 0 && (
            <>
              <p className="mb-4 text-sm font-medium">{t.comingSoon.followUs}</p>
              <div className="mb-8 flex justify-center gap-3">
                {socials.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </>
          )}
          <div className="flex items-center justify-center gap-2 font-display text-lg font-semibold">
            <Sprout className="h-5 w-5 text-primary" /> {settings.siteTitle}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            © {new Date().getFullYear()} {settings.siteTitle}. {t.comingSoon.rightsReserved}
          </p>
        </div>
      </footer>
    </main>
  );
}

function SectionLabel({ icon, text, center }: { icon: React.ReactNode; text: string; center?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground ${center ? "mx-auto" : ""}`}>
      {icon} {text}
    </span>
  );
}

function ProjectCard({ icon, title, body, image }: { icon: React.ReactNode; title: string; body: string; image: string }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-6">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</div>
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
