import Link from "next/link";
import { ActionCard } from "@/components/action-card";
import { Section } from "@/components/section";
import { requireRole } from "@/lib/permissions";

export default async function AdminPage() {
  const { role } = await requireRole(["TOON", "ADMIN", "MODERATOR"]);

  return (
    <Section eyebrow="Admin" title="Electric Crew control room">
      <div className="mb-8 rounded-lg border border-yellow-300/20 bg-yellow-300/10 p-5 text-yellow-50">
        Current role: {role}. TOON has full control. Admins can manage events, users, posts, and trusted status. Moderators can manage community posts and recommendations.
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <ActionCard title="Official events">
          Create, edit, publish, archive, feature, attach flyer images, and optionally announce published events through the private Discord webhook.
          <div className="mt-4">
            <Link className="font-bold text-yellow-200 hover:text-white" href="/admin/events">
              Manage events
            </Link>
          </div>
        </ActionCard>
        <ActionCard title="Community moderation">
          Approve, reject, delete, and feature submitted community posts. Normal members queue as pending; trusted crew can auto-approve.
        </ActionCard>
        <ActionCard title="Users and settings">
          Manage roles, trusted crew status, beta access, featured content, Discord status, and site settings. TOON cannot be demoted or deleted from the UI.
        </ActionCard>
      </div>
    </Section>
  );
}
