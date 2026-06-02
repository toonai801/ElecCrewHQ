import { DiscordLoginButton } from "@/components/discord-login-button";
import { Section } from "@/components/section";
import { isBetaLockEnabled } from "@/lib/beta-lock";

export default function LoginPage() {
  const locked = isBetaLockEnabled();
  const discordConfigured = Boolean(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET);

  return (
    <Section eyebrow="Login" title={locked ? "Join Electric Crew" : "Log in to Electric Crew"}>
      <div className="max-w-2xl rounded-lg border border-white/10 bg-white/[0.04] p-6 text-white/72">
        <p className="text-lg leading-8">
          Sign in with Discord to join Electric Crew.
        </p>
        {discordConfigured ? (
          <DiscordLoginButton />
        ) : (
          <div className="ec-panel ec-accent-discord mt-6 rounded-md p-4 text-sm text-[color:var(--ec-muted)]">
            Configure DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET to enable Discord OAuth.
          </div>
        )}
      </div>
    </Section>
  );
}
