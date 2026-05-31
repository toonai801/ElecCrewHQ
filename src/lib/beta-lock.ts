type BetaIdentity = {
  email?: string | null;
  discordId?: string | null;
  isBetaAllowed?: boolean | null;
};

const splitEnvList = (value?: string) =>
  (value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

export const isBetaLockEnabled = () =>
  (process.env.BETA_LOCK_ENABLED || "true").toLowerCase() === "true";

export function isBetaAllowed(identity: BetaIdentity) {
  if (!isBetaLockEnabled()) {
    return true;
  }

  if (identity.isBetaAllowed) {
    return true;
  }

  const email = identity.email?.toLowerCase();
  const discordId = identity.discordId?.toLowerCase();

  return (
    (!!email && splitEnvList(process.env.BETA_ALLOWED_EMAILS).includes(email)) ||
    (!!discordId && splitEnvList(process.env.BETA_ALLOWED_DISCORD_IDS).includes(discordId))
  );
}
