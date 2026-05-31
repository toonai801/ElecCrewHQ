import { ActionCard } from "@/components/action-card";
import { Section } from "@/components/section";
import { getAllUsersForAdmin, getModeratorRecommendationsForAdmin } from "@/lib/content";
import { requireRole } from "@/lib/permissions";
import {
  createTrustedCrewRecommendation,
  reviewTrustedCrewRecommendation,
} from "@/app/admin/recommendations/actions";

export default async function AdminRecommendationsPage() {
  const { role } = await requireRole(["TOON", "ADMIN", "MODERATOR"]);
  const [recommendations, users] = await Promise.all([
    getModeratorRecommendationsForAdmin(),
    getAllUsersForAdmin(),
  ]);
  const canReview = role === "TOON" || role === "ADMIN";
  const recommendableUsers = users.filter((user) => user.role === "MEMBER" || user.role === "TRUSTED_CREW");

  return (
    <Section eyebrow="Trusted Crew" title="Moderator recommendations">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <form action={createTrustedCrewRecommendation} className="ec-panel ec-accent-community rounded-lg p-5">
          <h2 className="text-xl font-black text-white">Recommend trusted status</h2>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-white/80">
              Member
              <select name="userId" required className="rounded-md border border-white/10 bg-black px-3 py-2 text-white">
                <option value="">Choose member</option>
                {recommendableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email || user.id} - {user.role}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/80">
              Reason
              <textarea name="reason" required className="min-h-32 rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
            </label>
            <button className="ec-button-primary px-4 py-3" type="submit">
              Send recommendation
            </button>
          </div>
        </form>

        <div className="grid gap-4">
          {recommendations.length ? recommendations.map((item) => (
            <ActionCard key={item.id} title={item.user.name || item.user.email || "Member"}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-black text-white">{item.status}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-white/50">{item.recommendationType}</p>
              </div>
              <p className="mt-3 text-white/75">{item.reason}</p>
              <p className="mt-3 text-xs text-white/50">
                Recommended by {item.moderator.name || item.moderator.email || "moderator"} on {item.createdAt.toLocaleDateString()}
              </p>
              {item.reviewedBy ? (
                <p className="mt-1 text-xs text-white/50">Reviewed by {item.reviewedBy.name || item.reviewedBy.email}</p>
              ) : null}
              {canReview ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {["APPROVED", "REJECTED", "PENDING"].map((status) => (
                    <form key={status} action={reviewTrustedCrewRecommendation}>
                      <input name="id" type="hidden" value={item.id} />
                      <input name="status" type="hidden" value={status} />
                      <button className="rounded-md border border-white/15 px-3 py-2 text-xs font-black text-white hover:bg-white/10" type="submit">
                        {status}
                      </button>
                    </form>
                  ))}
                </div>
              ) : null}
            </ActionCard>
          )) : (
            <div className="ec-panel rounded-lg p-5 text-[color:var(--ec-muted)]">No recommendations yet.</div>
          )}
        </div>
      </div>
    </Section>
  );
}
