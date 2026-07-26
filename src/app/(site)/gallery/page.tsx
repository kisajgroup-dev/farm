import Image from "next/image";
import { getDb } from "@/lib/prisma";

export const metadata = { title: "Gallery" };
export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = { rooftop: "Rooftop Garden", farm: "Farm Progress", harvest: "Harvest" };

export default async function GalleryPage() {
  const prisma = await getDb();
  const images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl font-semibold">Farm Gallery</h1>
      <p className="mt-2 text-muted-foreground">Rooftop garden, farm progress and harvest moments.</p>

      {images.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">Photos coming soon.</p>
      ) : (
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((img) => (
            <div key={img.id} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border">
              <div className="relative aspect-[4/3]">
                <Image src={img.imageUrl} alt={img.title || "Farm photo"} fill className="object-cover" />
              </div>
              <div className="flex items-center justify-between p-3 text-sm">
                <span>{img.title}</span>
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{LABELS[img.category] ?? img.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
