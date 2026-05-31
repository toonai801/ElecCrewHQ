import { Section } from "@/components/section";
import { isBetaLockEnabled } from "@/lib/beta-lock";

export default function LoginPage() {
  const locked = isBetaLockEnabled();
  const discordConfigured = Boolean(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET);

  return (
    <Section eyebrow="Login" title={locked ? "Beta access is locked" : "Log in to Electric Crew"}>
      <div className="max-w-2xl rounded-lg border border-white/10 bg-white/[0.04] p-6 text-white/72">
        <p className="text-lg leading-8">
          Account, profile, posting, and admin systems are in place. During beta, only TOON and explicitly allowed admin accounts can access protected areas.
        </p>
        {discordConfigured ? (
          <form className="mt-6" action="/api/auth/signin/discord" method="get">
            <button className="rounded-md bg-yellow-300 px-5 py-3 font-black text-black hover:bg-white" type="submit">
              Continue with Discord
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-md border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm text-yellow-50">
            Configure DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET to enable Discord OAuth.
          </div>
        )}
      </div>
    </Section>
  );
}
