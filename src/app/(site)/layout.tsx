import { redirect } from "next/navigation";
import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  // When Coming Soon mode is ON, hide all shop/farm pages behind the landing page.
  if (settings.comingSoonMode) redirect("/");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar settings={settings} />
      <div className="flex-1">{children}</div>
      <Footer settings={settings} />
    </div>
  );
}
