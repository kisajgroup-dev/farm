import Image from "next/image";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prisma = await getDb();
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      {post.publishedAt && <p className="text-sm text-muted-foreground">{format(new Date(post.publishedAt), "PPP")}</p>}
      <h1 className="mt-2 font-display text-4xl font-semibold">{post.title}</h1>
      {post.coverUrl && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl">
          <Image src={post.coverUrl} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <div className="prose mt-8 max-w-none">
        {post.content.split("\n").filter(Boolean).map((para, i) => (
          <p key={i} className="mb-4 leading-relaxed text-foreground/90">{para}</p>
        ))}
      </div>
    </article>
  );
}
