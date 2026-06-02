import { Section } from "@/components/section";
import { getAllUsersForAdmin } from "@/lib/content";
import { requireRole } from "@/lib/permissions";
import {
  clearUserDisplayNameOverride,
  toggleUserActive,
  toggleUserApproval,
  toggleUserBan,
  toggleUserBetaAccess,
  updateUserDisplayName,
  updateUserRole,
} from "@/app/admin/users/actions";

const roles = ["ADMIN", "MODERATOR", "TRUSTED_CREW", "MEMBER"];
const activeButtonClass =
  "rounded-md border border-[color:rgba(57,255,136,0.75)] bg-[color:rgba(57,255,136,0.20)] px-3 py-2 text-xs font-black text-[color:var(--ec-green)]";
const inactiveButtonClass = "ec-button-ghost px-3 py-2 text-xs font-black";

export default async function AdminUsersPage() {
  await requireRole(["TOON", "ADMIN"]);
  const users = await getAllUsersForAdmin();

  return (
    <Section eyebrow="Admin users" title="User roles and beta access">
      <div className="grid gap-4">
        {users.length ? users.map((user) => (
          <article key={user.id} className="ec-panel ec-accent-trusted rounded-lg p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">{user.displayName || user.name || user.email || "Unnamed user"}</h2>
                <p className="mt-1 text-sm text-[color:var(--ec-muted)]">
                  Discord: {user.name || "Unknown"} - {user.email || "No email"} - {user.role}
                </p>
                <p className="mt-1 text-sm text-[color:var(--ec-muted)]">
                  {user.isApproved ? "approved" : "pending"} - {user.isActive ? "active" : "inactive"} - {user.isBanned ? "banned" : "not banned"} - setup {user.onboardingComplete ? "complete" : "needed"}
                </p>
                <p className="mt-1 text-sm text-[color:var(--ec-muted)]">
                  Platforms: {user.platforms.length ? user.platforms.join(", ") : "none"} - Timezone: {user.timezone || "none"}
                </p>
                {user.role === "TOON" ? (
                  <p className="mt-2 text-sm font-bold text-[color:var(--ec-gold)]">TOON is protected from demotion/deletion.</p>
                ) : null}
              </div>

              {user.role !== "TOON" ? (
                <div className="flex flex-wrap gap-2">
                  <form action={updateUserRole} className="flex gap-2">
                    <input name="id" type="hidden" value={user.id} />
                    <select name="role" defaultValue={user.role} className="rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white">
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <button className="ec-button-ghost px-3 py-2 text-xs font-black" type="submit">
                      Save role
                    </button>
                  </form>
                  <form action={toggleUserBetaAccess}>
                    <input name="id" type="hidden" value={user.id} />
                    <input name="current" type="hidden" value={String(user.isBetaAllowed)} />
                    <button className={user.isBetaAllowed ? activeButtonClass : inactiveButtonClass} type="submit">
                      {user.isBetaAllowed ? "Block beta" : "Allow beta"}
                    </button>
                  </form>
                  <form action={toggleUserApproval}>
                    <input name="id" type="hidden" value={user.id} />
                    <input name="current" type="hidden" value={String(user.isApproved)} />
                    <button className={user.isApproved ? activeButtonClass : inactiveButtonClass} type="submit">
                      {user.isApproved ? "Approved" : "Approve"}
                    </button>
                  </form>
                  <form action={toggleUserActive}>
                    <input name="id" type="hidden" value={user.id} />
                    <input name="current" type="hidden" value={String(user.isActive)} />
                    <button className="rounded-md border border-[color:rgba(255,75,75,0.45)] px-3 py-2 text-xs font-black text-[color:var(--ec-red)]" type="submit">
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                  <form action={toggleUserBan}>
                    <input name="id" type="hidden" value={user.id} />
                    <input name="current" type="hidden" value={String(user.isBanned)} />
                    <button className="rounded-md border border-[color:rgba(255,75,75,0.45)] px-3 py-2 text-xs font-black text-[color:var(--ec-red)]" type="submit">
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
            {user.role !== "TOON" ? (
              <div className="mt-4 grid gap-3 rounded-lg border border-white/10 bg-black/35 p-4">
                <form action={updateUserDisplayName} className="flex flex-col gap-2 sm:flex-row">
                  <input name="id" type="hidden" value={user.id} />
                  <input
                    name="displayName"
                    defaultValue={user.displayName || user.name || ""}
                    className="min-w-0 flex-1 rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white"
                  />
                  <button className="ec-button-ghost px-3 py-2 text-xs font-black" type="submit">
                    Override name
                  </button>
                </form>
                {user.displayNameSource === "ADMIN_OVERRIDE" ? (
                  <form action={clearUserDisplayNameOverride}>
                    <input name="id" type="hidden" value={user.id} />
                    <button className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--ec-cyan)]" type="submit">
                      Clear name override
                    </button>
                  </form>
                ) : null}
              </div>
            ) : null}
          </article>
        )) : (
          <div className="ec-panel rounded-lg p-5 text-[color:var(--ec-muted)]">No users found.</div>
        )}
      </div>
    </Section>
  );
}
