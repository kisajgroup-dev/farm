import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { Sprout, Leaf, Heart } from "lucide-react";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-4xl font-semibold">About {settings.siteTitle}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        We are a small family organic farm based in Kalmunai, Sri Lanka. Our journey began with a rooftop
        garden at home and a small plot of land in Palamunai, where we grow fresh vegetables the natural
        way — no harmful chemicals, just healthy soil, sunshine and care.
      </p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
        <Image src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=80" alt="Our farm" fill className="object-cover" />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          { Icon: Sprout, title: "Naturally grown", body: "Compost, natural pest control and healthy soil — never harmful chemicals." },
          { Icon: Leaf, title: "Freshly harvested", body: "Picked to order so it reaches you at its freshest and most nutritious." },
          { Icon: Heart, title: "Family run", body: "A local Kalmunai family bringing honest, healthy food to our community." },
        ].map(({ Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6">
            <Icon className="h-7 w-7 text-primary" />
            <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
