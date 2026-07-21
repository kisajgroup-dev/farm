"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { LOCALES } from "@/lib/i18n/dictionaries";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full border border-border bg-background/60 p-1 backdrop-blur", className)}>
      <Globe className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            locale === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={locale === l.code}
        >
          {l.native}
        </button>
      ))}
    </div>
  );
}
