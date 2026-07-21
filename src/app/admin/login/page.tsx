import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { Sprout } from "lucide-react";

export const metadata = { title: "Admin Login" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sprout className="h-7 w-7" />
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
