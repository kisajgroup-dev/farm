import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { Sprout } from "lucide-react";

export const metadata = { title: "Admin Login" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-sm border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your farm</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
