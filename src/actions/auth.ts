"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(_prev: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  let redirectTo = "/admin";
  try {
    const prisma = await getDb();
    const admin = await prisma.admin.findUnique({ where: { email: parsed.data.username } });
    if (!admin) return { error: "Invalid username or password" };

    const valid = await verifyPassword(parsed.data.password, admin.passwordHash);
    if (!valid) return { error: "Invalid username or password" };

    await createSession({ sub: admin.id, email: admin.email, name: admin.name, role: admin.role });
    const from = formData.get("from");
    if (typeof from === "string" && from.startsWith("/admin")) redirectTo = from;
  } catch (err: any) {
    console.error("Login action error:", err);
    return { error: `Login error: ${err?.message || String(err)}` };
  }
  redirect(redirectTo);
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
