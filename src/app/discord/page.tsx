import { MessageCircle } from "lucide-react";
import { Section } from "@/components/section";
import { discordInviteUrl } from "@/lib/sample-data";

export default function DiscordPage() {
  const widgetId = process.env.NEXT_PUBLIC_DISCORD_WIDGET_ID;

  return (
    <Section eyebrow="Discord" title="Join the Electric Crew Discord">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <MessageCircle className="mb-4 size-8 text-cyan-200" />
          <p className="text-lg leading-8 text-white/72">
            Discord is the home for event details, RSVP updates, crew announcements, beta access, and future account connection.
          </p>
          <a href={discordInviteUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-md bg-yellow-300 px-5 py-3 font-black text-black hover:bg-white">
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
