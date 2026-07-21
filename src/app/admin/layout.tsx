import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  // Login page renders its own tree; guard everything else.
  if (!session) {
    // middleware already redirects, but double-guard for safety on the layout.
    return <>{children}</>;
  }
  return <AdminShell name={session.name}>{children}</AdminShell>;
}
