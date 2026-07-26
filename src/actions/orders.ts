"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/prisma";
import { getSession } from "@/lib/session";
type OrderStatus = "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  const prisma = await getDb();
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
}

export async function markInquiry(id: string, handled: boolean) {
  await requireAdmin();
  const prisma = await getDb();
  await prisma.inquiry.update({ where: { id }, data: { handled } });
  revalidatePath("/admin/orders");
}
