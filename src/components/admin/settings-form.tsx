"use client";

import { useActionState, useState, useTransition, useRef } from "react";
import { updateSettings, toggleComingSoon } from "@/actions/settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Power, Upload, X } from "lucide-react";

interface Props {
  settings: {
    comingSoonMode: boolean;
    siteTitle: string; tagline: string; description: string;
    logoUrl: string | null; backgroundUrl: string | null;
    launchDate: string;
    whatsappNumber: string; email: string; addressText: string;
    mapLat: number; mapLng: number;
    facebookUrl: string | null; instagramUrl: string | null;
    tiktokUrl: string | null; youtubeUrl: string | null;
  };
}

function Field({ label, name, defaultValue, placeholder, type = "text" }: {
  label: string; name: string; defaultValue?: string | number | null; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder} className="mt-1.5" />
    </div>
  );
}

function ImageUploadField({ label, name, defaultValue, previewClass = "h-16 w-16" }: {
  label: string; name: string; defaultValue?: string | null; previewClass?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUrl(data.url ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <Label>{label}</Label>
      {/* the value that actually gets saved with the form */}
      <input type="hidden" name={name} value={url} readOnly />
      <div className="mt-1.5 flex items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className={`${previewClass} rounded-lg border object-cover`} />
        ) : (
          <div className={`${previewClass} flex items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground`}>
            None
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" id={`file-${name}`} />
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
              <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : url ? "Replace" : "Upload image"}
            </Button>
            {url && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setUrl("")}>
                <X className="h-4 w-4" /> Remove
              </Button>
            )}
          </div>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="…or paste an image URL"
            className="h-8 text-xs"
          />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function SettingsForm({ settings }: Props) {
  const [state, action, pending] = useActionState(updateSettings, { ok: false, error: null as string | null });
  const [comingSoon, setComingSoon] = useState(settings.comingSoonMode);
  const [isToggling, startToggle] = useTransition();

  function onToggle(next: boolean) {
    setComingSoon(next);
    startToggle(async () => { await toggleComingSoon(next); });
  }

  return (
    <div className="space-y-6">
      {/* MODE CONTROL */}
      <Card className={comingSoon ? "border-amber-300" : "border-green-300"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Power className="h-5 w-5" /> Coming Soon Mode</CardTitle>
          <CardDescription>
            When ON, visitors see only the Coming Soon page. When OFF, the full shop goes live — no code changes needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
            <div>
              <p className="font-medium">{comingSoon ? "Coming Soon page is showing" : "Full website is live"}</p>
              <p className="text-sm text-muted-foreground">{isToggling ? "Saving..." : comingSoon ? "Toggle off to launch your shop" : "Toggle on to hide the shop again"}</p>
            </div>
            <Switch checked={comingSoon} onCheckedChange={onToggle} disabled={isToggling} />
          </div>
        </CardContent>
      </Card>

      {/* BRAND + CONTACT */}
      <form action={action}>
        <Card>
          <CardHeader><CardTitle>Brand & Content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Website title" name="siteTitle" defaultValue={settings.siteTitle} />
            <Field label="Tagline" name="tagline" defaultValue={settings.tagline} />
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={settings.description} className="mt-1.5" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <ImageUploadField label="Logo" name="logoUrl" defaultValue={settings.logoUrl} />
              <ImageUploadField label="Background image" name="backgroundUrl" defaultValue={settings.backgroundUrl} previewClass="h-16 w-24" />
            </div>
            <Field label="Launch date" name="launchDate" type="date" defaultValue={settings.launchDate} />
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader><CardTitle>Contact & Location</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="WhatsApp number" name="whatsappNumber" defaultValue={settings.whatsappNumber} placeholder="+9477xxxxxxx" />
              <Field label="Email" name="email" defaultValue={settings.email} />
            </div>
            <Field label="Address" name="addressText" defaultValue={settings.addressText} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Map latitude" name="mapLat" type="number" defaultValue={settings.mapLat} />
              <Field label="Map longitude" name="mapLng" type="number" defaultValue={settings.mapLng} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook" name="facebookUrl" defaultValue={settings.facebookUrl} placeholder="https://facebook.com/..." />
            <Field label="Instagram" name="instagramUrl" defaultValue={settings.instagramUrl} placeholder="https://instagram.com/..." />
            <Field label="TikTok" name="tiktokUrl" defaultValue={settings.tiktokUrl} placeholder="https://tiktok.com/@..." />
            <Field label="YouTube" name="youtubeUrl" defaultValue={settings.youtubeUrl} placeholder="https://youtube.com/..." />
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save settings"}</Button>
          {state.ok && <span className="text-sm text-green-600">✔ Saved</span>}
          {state.error && <span className="text-sm text-destructive">{state.error}</span>}
        </div>
      </form>
    </div>
  );
}
