import Link from "next/link";
import { ActionCard } from "@/components/action-card";
import { Section } from "@/components/section";
import { requireRole } from "@/lib/permissions";

export default async function AdminPage() {
  const { role } = await requireRole(["TOON", "ADMIN", "MODERATOR"]);

  return (
    <Section eyebrow="Admin" title="Electric Crew control room">
      <div className="ec-panel ec-accent-warning mb-8 rounded-lg p-5 text-[color:var(--ec-muted)]">
        Current role: {role}. TOON has full control. Admins can manage events, users, posts, and trusted status. Moderators can manage community posts and recommendations.
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <ActionCard title="Official events">
          Create, edit, publish, archive, feature, attach flyer images, and optionally announce published events through the private Discord webhook.
          <div className="mt-4">
            <Link className="font-bold text-[color:var(--ec-orange)] hover:text-white" href="/admin/events">
              Manage events
            </Link>
          </div>
        </ActionCard>
        <ActionCard title="Community moderation">
          Approve, reject, delete, and feature submitted community posts. Normal members queue as pending; trusted crew can auto-approve.
          <div className="mt-4">
            <Link className="font-bold text-[color:var(--ec-violet)] hover:text-white" href="/admin/community">
              Moderate posts
            </Link>
          </div>
        </ActionCard>
        <ActionCard title="Users and settings">
          Manage roles, beta access, active status, and trusted status. TOON cannot be demoted or deleted from the UI.
          <div className="mt-4">
            <Link className="font-bold text-[color:var(--ec-green)] hover:text-white" href="/admin/users">
              Manage users
            </Link>
          </div>
        </ActionCard>
        <ActionCard title="Trusted Crew recommendations">
          Moderators can recommend members for trusted status. TOON and admins can approve or reject those recommendations.
          <div className="mt-4">
            <Link className="font-bold text-[color:var(--ec-cyan)] hover:text-white" href="/admin/recommendations">
              Review recommendations
            </Link>
          </div>
        </ActionCard>
        <ActionCard title="Site settings">
          Control operational settings for Discord links, community posting, auto-approval, announcements, and upload readiness.
          <div className="mt-4">
            <Link className="font-bold text-[color:var(--ec-magenta)] hover:text-white" href="/admin/settings">
              Manage settings
            </Link>
          </div>
        </ActionCard>
      </div>
    </Section>
  );
}
