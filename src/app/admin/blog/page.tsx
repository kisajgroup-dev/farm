import { prisma } from "@/lib/prisma";
import { BlogManager } from "@/components/admin/blog-manager";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const rows = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  const posts = rows.map((p) => ({
    id: p.id, title: p.title, excerpt: p.excerpt, content: p.content,
    coverUrl: p.coverUrl, published: p.published,
  }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Blog / Updates</h1>
        <p className="mt-1 text-muted-foreground">Post farming updates, harvest news and announcements.</p>
      </div>
      <BlogManager posts={posts} />
    </div>
  );
}
