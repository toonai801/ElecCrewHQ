import Link from "next/link";
import { Section } from "@/components/section";
import { ImageUploadField } from "@/components/image-upload-field";
import { getAccountProfile, getMyCommunityPosts } from "@/lib/content";
import { requireRole } from "@/lib/permissions";
import { deleteOwnPendingPost, updateProfile } from "@/app/account/actions";

export default async function AccountPage() {
  const { session } = await requireRole(["TOON", "ADMIN", "MODERATOR", "TRUSTED_CREW", "MEMBER"]);
  const [posts, profile] = await Promise.all([
    getMyCommunityPosts(session.user.id),
    getAccountProfile(session.user.id),
  ]);
  const displayName = profile?.name || session.user.name || "";
  const avatarUrl = profile?.avatarUrl || session.user.avatarUrl || "";
  const bio = profile?.bio || session.user.bio || "";
  const role = profile?.role || session.user.role;

  return (
    <Section eyebrow="Account" title="Profile dashboard">
      <div className="ec-panel ec-accent-trusted mb-8 rounded-lg p-5 text-[color:var(--ec-muted)]">
        Signed in as {displayName || profile?.email || session.user.email || "Electric Crew member"} with role {role}.
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-6">
          <form action={updateProfile} className="ec-panel ec-accent-trusted rounded-lg p-5">
            <h2 className="text-xl font-black text-white">Profile</h2>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-white/80">
                Display name
                <input name="name" defaultValue={displayName} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-green)]" />
              </label>
              <ImageUploadField name="avatarUrl" label="Avatar image" defaultValue={avatarUrl} accent="var(--ec-green)" />
              <label className="grid gap-2 text-sm font-bold text-white/80">
                Bio
                <textarea name="bio" defaultValue={bio} className="min-h-28 rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-green)]" />
              </label>
              <button className="ec-button-primary px-4 py-3" type="submit">
                Save profile
              </button>
            </div>
          </form>

          <div className="ec-panel ec-accent-community rounded-lg p-5">
            <h2 className="text-xl font-black text-white">Community posting</h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--ec-muted)]">
              Add new posts from the community feed so posting happens in the right place.
            </p>
            <Link href="/add-post" className="ec-button-cyan mt-4 inline-flex px-4 py-3 font-black">
              Add post
            </Link>
          </div>
        </div>

        <div className="ec-panel rounded-lg p-5">
          <h2 className="text-xl font-black text-white">My posts</h2>
          <div className="mt-5 grid gap-4">
            {posts.length ? posts.map((post) => (
              <article key={post.id} className="rounded-lg border border-white/10 bg-black/35 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-white">{post.title}</p>
                    <p className="text-sm text-[color:var(--ec-muted)]">{post.postType} - {post.status} - {post.createdAt.toLocaleDateString()}</p>
                  </div>
                  {post.status === "PENDING" ? (
                    <form action={deleteOwnPendingPost}>
                      <input name="id" type="hidden" value={post.id} />
                      <button className="rounded-md border border-[color:rgba(255,75,75,0.45)] px-3 py-2 text-xs font-black text-[color:var(--ec-red)]" type="submit">
                        Delete pending
                      </button>
                    </form>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-[color:var(--ec-muted)]">{post.body}</p>
              </article>
            )) : (
              <p className="text-[color:var(--ec-muted)]">No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
