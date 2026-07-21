"use client";

import { useActionState } from "react";
import { submitInquiry } from "@/actions/inquiry";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initial = { ok: false, error: null as string | null };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitInquiry, initial);

  if (state.ok) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border bg-secondary/50 p-8 text-center">
        <div>
          <p className="font-display text-xl font-semibold">Thank you! 🌱</p>
          <p className="mt-2 text-sm text-muted-foreground">We received your message and will reply soon.</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required className="mt-1.5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone / WhatsApp</Label>
          <Input id="phone" name="phone" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" type="email" className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required className="mt-1.5" rows={5} />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
