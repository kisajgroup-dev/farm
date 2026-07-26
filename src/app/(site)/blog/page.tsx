import Image from "next/image";
import Link from "next/link";
import { getDb } from "@/lib/prisma";
import { format } from "date-fns";

export const metadata = { title: "Updates" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const prisma = await getDb();
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-4xl font-semibold">Farm Updates</h1>
      <p className="mt-2 text-muted-foreground">Harvest news, new products and stories from the farm.</p>

      {posts.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No updates yet — check back soon.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card sm:flex-row">
              {post.coverUrl && (
                <div className="relative aspect-[16/10] w-full shrink-0 sm:aspect-square sm:w-48">
                  <Image src={post.coverUrl} alt={post.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-5">
                {post.publishedAt && <p className="text-xs text-muted-foreground">{format(new Date(post.publishedAt), "PPP")}</p>}
                <h2 className="mt-1 font-display text-xl font-semibold group-hover:text-primary">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
