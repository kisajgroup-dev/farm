"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
}

const productSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(1000).optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  price: z.coerce.number().min(0),
  unit: z.enum(["KG", "PACK", "BUNCH", "PIECE", "GRAM", "LITRE"]),
  quantity: z.coerce.number().min(0),
  categoryId: z.string().optional().or(z.literal("")),
  available: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
});

export async function saveProduct(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string | null;
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const d = parsed.data;
  const data = {
    name: d.name,
    description: d.description || null,
    imageUrl: d.imageUrl || null,
    price: d.price,
    unit: d.unit,
    quantity: d.quantity,
    categoryId: d.categoryId || null,
    available: formData.get("available") === "on",
    featured: formData.get("featured") === "on",
  };

  try {
    const prisma = await getDb();
    if (id) {
      await prisma.product.update({ where: { id }, data });
    } else {
      await prisma.product.create({ data: { ...data, slug: `${slugify(d.name)}-${Date.now().toString(36)}` } });
    }
    revalidatePath("/admin/products");
    revalidatePath("/", "layout");
    return { ok: true, error: null };
  } catch {
    return { ok: false, error: "Could not save product." };
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const prisma = await getDb();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
}

export async function updateStock(id: string, quantity: number, available: boolean) {
  await requireAdmin();
  const prisma = await getDb();
  await prisma.product.update({ where: { id }, data: { quantity, available } });
  revalidatePath("/admin/inventory");
  revalidatePath("/", "layout");
}

export async function createCategory(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const name = (formData.get("name") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim() || null;
  if (!name) return { ok: false, error: "Category name is required" };

  try {
    const prisma = await getDb();
    const slug = slugify(name);
    await prisma.category.upsert({
      where: { slug },
      update: { name, description },
      create: { name, slug, description },
    });
    revalidatePath("/admin/products");
    revalidatePath("/", "layout");
    return { ok: true, error: null };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Could not create category" };
  }
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  try {
    const prisma = await getDb();
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/", "layout");
    return { ok: true, error: null };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Could not delete category" };
  }
}
