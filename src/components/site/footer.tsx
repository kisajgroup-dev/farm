"use client";

import Link from "next/link";
import { Sprout, MapPin, MessageCircle, Facebook, Instagram, Youtube } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsAppContactLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/settings";

export function Footer({ settings }: { settings: SiteSettings }) {
  const { t } = useLanguage();
  const wa = buildWhatsAppContactLink(settings.whatsappNumber);
  const socials = [
    { url: settings.facebookUrl, Icon: Facebook },
    { url: settings.instagramUrl, Icon: Instagram },
    { url: settings.youtubeUrl, Icon: Youtube },
  ].filter((s) => s.url);

  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 font-display text-lg font-semibold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.logoUrl || "/logo.png"} alt={settings.siteTitle} className="h-7 w-7 rounded-full object-contain" />
            {settings.siteTitle}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{settings.tagline}</p>
        </div>
        <div className="text-sm">
          <p className="font-medium">{t.nav.contact}</p>
          <a href={wa} className="mt-3 flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <MessageCircle className="h-4 w-4" /> {settings.whatsappNumber}
          </a>
          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {settings.addressText}
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium">{t.nav.home}</p>
          <div className="mt-3 flex flex-col gap-2 text-muted-foreground">
            <Link href="/products" className="hover:text-foreground">{t.nav.products}</Link>
            <Link href="/about" className="hover:text-foreground">{t.nav.about}</Link>
            <Link href="/blog" className="hover:text-foreground">{t.nav.blog}</Link>
          </div>
          {socials.length > 0 && (
            <div className="mt-4 flex gap-2">
              {socials.map(({ url, Icon }, i) => (
                <a key={i} href={url!} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-primary hover:text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {settings.siteTitle}. {t.comingSoon.rightsReserved}
      </div>
    </footer>
  );
}
