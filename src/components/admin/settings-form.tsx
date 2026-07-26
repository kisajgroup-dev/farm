"use client";

import { useActionState, useState, useTransition, useRef } from "react";
import { updateSettings, toggleComingSoon, createAdminUser, resetAdminPassword, deleteAdminUser } from "@/actions/settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Power, Upload, X, Users, UserPlus, KeyRound, Trash2 } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date | string;
}

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
  adminUsers: AdminUser[];
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

export function SettingsForm({ settings, adminUsers }: Props) {
  const [state, action, pending] = useActionState(updateSettings, { ok: false, error: null as string | null });
  const [createUserState, createUserAction, createUserPending] = useActionState(createAdminUser, { ok: false, error: null as string | null });
  const [resetState, resetAction, resetPending] = useActionState(resetAdminPassword, { ok: false, error: null as string | null });

  const [comingSoon, setComingSoon] = useState(settings.comingSoonMode);
  const [isToggling, startToggle] = useTransition();
  const [, startDelete] = useTransition();

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
            When ON, visitors see only the Coming Soon page. When OFF, the full shop goes live.
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

      {/* ADMIN USER MANAGEMENT & PASSWORD RESET */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Admin Users & Password Reset
          </CardTitle>
          <CardDescription>Add new admin accounts or change existing user passwords.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User List Table */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">Current Admin Accounts ({adminUsers.length})</h4>
            <div className="rounded-lg border">
              <Table>
                <THead>
                  <TR>
                    <TH>Username</TH>
                    <TH>Name</TH>
                    <TH>Role</TH>
                    <TH></TH>
                  </TR>
                </THead>
                <TBody>
                  {adminUsers.map((u) => (
                    <TR key={u.id}>
                      <TD className="font-medium">{u.email}</TD>
                      <TD>{u.name}</TD>
                      <TD><Badge variant="secondary">{u.role}</Badge></TD>
                      <TD>
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete User"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete user "${u.email}"?`)) {
                                startDelete(async () => {
                                  await deleteAdminUser(u.id);
                                });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 pt-2 border-t">
            {/* Create User Form */}
            <form action={createUserAction} className="space-y-3 rounded-xl bg-secondary/30 p-4 border">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <UserPlus className="h-4 w-4 text-primary" /> Add New Admin User
              </div>
              <div>
                <Label htmlFor="create-username" className="text-xs">Username / Email</Label>
                <Input id="create-username" name="username" placeholder="e.g. manager" required className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label htmlFor="create-name" className="text-xs">Display Name</Label>
                <Input id="create-name" name="name" placeholder="e.g. John Doe" className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label htmlFor="create-password" className="text-xs">Password</Label>
                <Input id="create-password" name="password" type="password" required className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label htmlFor="create-role" className="text-xs">Role</Label>
                <Select id="create-role" name="role" defaultValue="ADMIN" className="mt-1 h-9 text-sm">
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPERADMIN">SUPERADMIN</option>
                </Select>
              </div>
              {createUserState.ok && <p className="text-xs text-green-600">✔ Admin user created successfully!</p>}
              {createUserState.error && <p className="text-xs text-destructive">{createUserState.error}</p>}
              <Button type="submit" size="sm" disabled={createUserPending} className="w-full mt-2">
                {createUserPending ? "Creating..." : "Create User"}
              </Button>
            </form>

            {/* Reset Password Form */}
            <form action={resetAction} className="space-y-3 rounded-xl bg-secondary/30 p-4 border">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <KeyRound className="h-4 w-4 text-primary" /> Reset User Password
              </div>
              <div>
                <Label htmlFor="reset-username" className="text-xs">Select / Enter Username</Label>
                <Select id="reset-username" name="username" className="mt-1 h-9 text-sm" required>
                  <option value="">— Select Username —</option>
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.email}>{u.email} ({u.name})</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="reset-newPassword" className="text-xs">New Password</Label>
                <Input id="reset-newPassword" name="newPassword" type="password" placeholder="Enter new password" required className="mt-1 h-9 text-sm" />
              </div>
              {resetState.ok && <p className="text-xs text-green-600">✔ Password updated successfully!</p>}
              {resetState.error && <p className="text-xs text-destructive">{resetState.error}</p>}
              <Button type="submit" size="sm" variant="secondary" disabled={resetPending} className="w-full mt-2">
                {resetPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
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
