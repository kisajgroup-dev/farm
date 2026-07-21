"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
}

const schema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().max(300).optional().or(z.literal("")),
  content: z.string().min(1),
  coverUrl: z.string().url().optional().or(z.literal("")),
});

export async function saveBlogPost(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string | null;
  const published = formData.get("published") === "on";
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  try {
    if (id) {
      await prisma.blogPost.update({
        where: { id },
        data: {
          title: d.title, excerpt: d.excerpt || null, content: d.content,
          coverUrl: d.coverUrl || null, published,
          publishedAt: published ? new Date() : null,
        },
      });
    } else {
      await prisma.blogPost.create({
        data: {
          title: d.title, slug: `${slugify(d.title)}-${Date.now().toString(36)}`,
          excerpt: d.excerpt || null, content: d.content, coverUrl: d.coverUrl || null,
          published, publishedAt: published ? new Date() : null,
        },
      });
    }
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { ok: true, error: null };
  } catch {
    return { ok: false, error: "Could not save post." };
  }
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
