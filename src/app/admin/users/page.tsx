import { Section } from "@/components/section";
import { getAllUsersForAdmin } from "@/lib/content";
import { requireRole } from "@/lib/permissions";
import { toggleUserActive, toggleUserBetaAccess, updateUserRole } from "@/app/admin/users/actions";

const roles = ["ADMIN", "MODERATOR", "TRUSTED_CREW", "MEMBER"];

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
                <h2 className="text-xl font-black text-white">{user.name || user.email || "Unnamed user"}</h2>
                <p className="mt-1 text-sm text-[color:var(--ec-muted)]">
                  {user.email || "No email"} - {user.role} - beta {user.isBetaAllowed ? "allowed" : "blocked"} - {user.isActive ? "active" : "inactive"}
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
                    <button className="ec-button-ghost px-3 py-2 text-xs font-black" type="submit">
                      {user.isBetaAllowed ? "Block beta" : "Allow beta"}
                    </button>
                  </form>
                  <form action={toggleUserActive}>
                    <input name="id" type="hidden" value={user.id} />
                    <input name="current" type="hidden" value={String(user.isActive)} />
                    <button className="rounded-md border border-[color:rgba(255,75,75,0.45)] px-3 py-2 text-xs font-black text-[color:var(--ec-red)]" type="submit">
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </article>
        )) : (
          <div className="ec-panel rounded-lg p-5 text-[color:var(--ec-muted)]">No users found.</div>
        )}
      </div>
    </Section>
  );
}
