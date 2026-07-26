import { getSettings } from "@/lib/settings";
import { getAdminUsers } from "@/actions/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  const users = await getAdminUsers();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Website Settings</h1>
        <p className="mt-1 text-muted-foreground">Control site mode, brand details, and manage admin users & passwords.</p>
      </div>
      <SettingsForm
        settings={{
          ...settings,
          launchDate: settings.launchDate ? new Date(settings.launchDate).toISOString().slice(0, 10) : "",
        }}
        adminUsers={users}
      />
    </div>
  );
}
