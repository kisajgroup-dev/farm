"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: null as string | null });
  const from = useSearchParams().get("from") ?? "/admin";

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={action} className="space-y-4">
          <input type="hidden" name="from" value={from} />
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" type="text" placeholder="admin" autoComplete="username" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required className="mt-1.5" />
          </div>
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
