"use server";

import { z } from "zod";
import { getDb } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  phone: z.string().max(40).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(1, "Message is required").max(2000),
});

export async function submitInquiry(_prev: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  try {
    const prisma = await getDb();
    await prisma.inquiry.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        message: parsed.data.message,
      },
    });
    return { ok: true, error: null };
  } catch {
    return { ok: false, error: "Something went wrong. Please try WhatsApp instead." };
  }
}
