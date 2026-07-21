import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Website Settings</h1>
        <p className="mt-1 text-muted-foreground">Control your site mode, brand and contact details.</p>
      </div>
      <SettingsForm
        settings={{
          ...settings,
          launchDate: settings.launchDate ? new Date(settings.launchDate).toISOString().slice(0, 10) : "",
        }}
      />
    </div>
  );
}
