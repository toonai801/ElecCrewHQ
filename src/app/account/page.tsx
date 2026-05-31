import { ActionCard } from "@/components/action-card";
import { Section } from "@/components/section";
import { requireRole } from "@/lib/permissions";

export default async function AccountPage() {
  const { session } = await requireRole(["TOON", "ADMIN", "MODERATOR", "TRUSTED_CREW", "MEMBER"]);

  return (
    <Section eyebrow="Account" title="Profile dashboard">
      <div className="ec-panel ec-accent-trusted mb-8 rounded-lg p-5 text-[color:var(--ec-muted)]">
        Signed in as {session.user.name || session.user.email || "Electric Crew member"} with role {session.user.role}.
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <ActionCard title="Profile">
          View and edit display name, avatar URL, bio, Discord identity, role/status, and active beta allowance.
        </ActionCard>
        <ActionCard title="My posts">
          Review submitted posts, see approval status, and edit or delete pending posts after public member login is unlocked.
        </ActionCard>
        <ActionCard title="Submit post">
          Event info, flyer images, VR photos, text updates, links, tags, and visibility are validated before save.
        </ActionCard>
      </div>
    </Section>
  );
}
