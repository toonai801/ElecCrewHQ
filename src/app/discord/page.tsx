import { MessageCircle } from "lucide-react";
import { Section } from "@/components/section";
import { getSiteSettings } from "@/lib/content";
import { discordInviteUrl } from "@/lib/sample-data";

export default async function DiscordPage() {
  const settings = await getSiteSettings();
  const inviteUrl = typeof settings.discordInviteUrl === "string" && settings.discordInviteUrl ? settings.discordInviteUrl : discordInviteUrl;

  return (
    <Section eyebrow="Discord" title="Join the Electric Crew Discord">
      <div className="ec-panel ec-accent-discord max-w-2xl rounded-lg p-6">
        <MessageCircle className="mb-4 size-8 text-[color:var(--ec-blue)]" />
        <p className="text-lg leading-8 text-white/72">
          Join the Discord to connect with Electric Crew, find event updates, and hang with the community.
        </p>
        <a href={inviteUrl} target="_blank" rel="noreferrer" className="ec-button-cyan mt-6 inline-flex px-5 py-3 font-black">
          Join Discord
        </a>
      </div>
    </Section>
  );
}
