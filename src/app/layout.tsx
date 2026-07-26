import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { LanguageProvider } from "@/components/providers/language-provider";
import { getSettings } from "@/lib/settings";
import "./globals.css";

// Site metadata comes from Postgres and must be read at request time.
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { default: s.siteTitle, template: `%s · ${s.siteTitle}` },
    description: s.description,
    openGraph: { title: s.siteTitle, description: s.description, type: "website" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
