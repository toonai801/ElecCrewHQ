import { Section } from "@/components/section";
import { getSiteSettings } from "@/lib/content";
import { requireRole } from "@/lib/permissions";
import { updateSiteSettings } from "@/app/admin/settings/actions";

function stringSetting(settings: Record<string, unknown>, key: string) {
  const value = settings[key];
  return typeof value === "string" ? value : "";
}

function boolSetting(settings: Record<string, unknown>, key: string) {
  return settings[key] === true;
}

export default async function AdminSettingsPage() {
  await requireRole(["TOON", "ADMIN"]);
  const settings = await getSiteSettings();
  const uploadsReady = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const webhookReady = Boolean(process.env.DISCORD_WEBHOOK_URL);

  return (
    <Section eyebrow="Settings" title="Site operations">
      <form action={updateSiteSettings} className="ec-panel ec-accent-trusted rounded-lg p-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-white/80">
            Discord invite URL
            <input name="discordInviteUrl" defaultValue={stringSetting(settings, "discordInviteUrl")} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-white/80">
            Discord widget ID
            <input name="discordWidgetId" defaultValue={stringSetting(settings, "discordWidgetId")} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-white/80 lg:col-span-2">
            Homepage announcement
            <textarea name="homepageAnnouncement" defaultValue={stringSetting(settings, "homepageAnnouncement")} className="min-h-28 rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
          </label>
          <label className="flex items-center gap-3 text-sm font-bold text-white/80">
            <input name="communityPostingLocked" type="checkbox" defaultChecked={boolSetting(settings, "communityPostingLocked")} />
            Lock public community submissions
          </label>
          <label className="flex items-center gap-3 text-sm font-bold text-white/80">
            <input name="trustedCrewAutoApprove" type="checkbox" defaultChecked={boolSetting(settings, "trustedCrewAutoApprove")} />
            Trusted Crew posts auto-approve
          </label>
        </div>
        <div className="mt-6 grid gap-3 rounded-lg border border-white/10 bg-black/35 p-4 text-sm text-[color:var(--ec-muted)] sm:grid-cols-2">
          <p>File uploads: {uploadsReady ? "ready" : "needs SUPABASE_SERVICE_ROLE_KEY"}</p>
          <p>Discord announcements: {webhookReady ? "ready" : "needs DISCORD_WEBHOOK_URL"}</p>
        </div>
        <button className="ec-button-primary mt-6 px-4 py-3" type="submit">
          Save settings
        </button>
      </form>
    </Section>
  );
}
