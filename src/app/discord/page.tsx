import { MessageCircle } from "lucide-react";
import { Section } from "@/components/section";
import { getSiteSettings } from "@/lib/content";
import { discordInviteUrl } from "@/lib/sample-data";

export default async function DiscordPage() {
  const settings = await getSiteSettings();
  const inviteUrl = typeof settings.discordInviteUrl === "string" && settings.discordInviteUrl ? settings.discordInviteUrl : discordInviteUrl;
  const widgetId =
    typeof settings.discordWidgetId === "string" && settings.discordWidgetId
      ? settings.discordWidgetId
      : process.env.NEXT_PUBLIC_DISCORD_WIDGET_ID;

  return (
    <Section eyebrow="Discord" title="Join the Electric Crew Discord">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="ec-panel ec-accent-discord rounded-lg p-6">
          <MessageCircle className="mb-4 size-8 text-[color:var(--ec-blue)]" />
          <p className="text-lg leading-8 text-white/72">
            Discord is the home for event details, RSVP updates, crew announcements, beta access, and future account connection.
          </p>
          <a href={inviteUrl} target="_blank" rel="noreferrer" className="ec-button-cyan mt-6 inline-flex px-5 py-3 font-black">
            Open Discord Invite
          </a>
        </div>
        {widgetId ? (
          <iframe
            title="Electric Crew Discord widget"
            src={`https://discord.com/widget?id=${widgetId}&theme=dark`}
            className="min-h-[420px] w-full rounded-lg border border-white/10"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        ) : (
          <div className="rounded-lg border border-white/10 bg-black/45 p-6 text-white/65">
            Add NEXT_PUBLIC_DISCORD_WIDGET_ID to show the official Discord widget here.
          </div>
        )}
      </div>
    </Section>
  );
}
