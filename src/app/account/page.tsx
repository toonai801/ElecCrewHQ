import Link from "next/link";
import { Section } from "@/components/section";
import { ImageUploadField } from "@/components/image-upload-field";
import { getAccountProfile, getMyCommunityPosts } from "@/lib/content";
import { requireSignedIn } from "@/lib/permissions";
import { platformOptions } from "@/lib/validators";
import { deleteOwnPendingPost, updateProfile } from "@/app/account/actions";

export default async function AccountPage() {
  const { session } = await requireSignedIn();
  const [posts, profile] = await Promise.all([
    getMyCommunityPosts(session.user.id),
    getAccountProfile(session.user.id),
  ]);
  const displayName = profile?.displayName || session.user.displayName || profile?.name || session.user.name || "";
  const avatarUrl = profile?.avatarUrl || session.user.avatarUrl || "";
  const bio = profile?.bio || session.user.bio || "";
  const pronouns = profile?.pronouns || "";
  const timezone = profile?.timezone || "";
  const platforms = profile?.platforms || [];
  const role = profile?.role || session.user.role;
  const setupComplete = profile?.onboardingComplete || session.user.onboardingComplete;
  const isApproved = session.user.role === "TOON" || session.user.isApproved;

  return (
    <Section eyebrow="Account" title="Profile dashboard">
      <div className="ec-panel ec-accent-trusted mb-8 rounded-lg p-5 text-[color:var(--ec-muted)]">
        Signed in as {displayName || profile?.email || session.user.email || "Electric Crew member"} with role {role}.
        {!setupComplete ? <span className="block mt-2 text-[color:var(--ec-gold)]">Finish setup to use member features.</span> : null}
        {setupComplete && !isApproved ? <span className="block mt-2 text-[color:var(--ec-gold)]">Your account is waiting for admin approval.</span> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-6">
          <form action={updateProfile} className="ec-panel ec-accent-trusted rounded-lg p-5">
            <h2 className="text-xl font-black text-white">Profile</h2>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-2 text-sm font-bold text-white/80">
                Display name
                <div className="rounded-md border border-white/10 bg-black px-3 py-2 text-white">
                  {displayName || "Discord name pending"}
                </div>
              </div>
              <ImageUploadField name="avatarUrl" label="Avatar image" defaultValue={avatarUrl} accent="var(--ec-green)" uploadType="avatar" />
              <label className="grid gap-2 text-sm font-bold text-white/80">
                Pronouns
                <input name="pronouns" defaultValue={pronouns} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-green)]" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-white/80">
                Bio
                <textarea name="bio" defaultValue={bio} className="min-h-28 rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-green)]" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-white/80">
                Timezone
                <input name="timezone" required defaultValue={timezone} placeholder="America/Denver" className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-green)]" />
              </label>
              <fieldset className="grid gap-3 text-sm font-bold text-white/80">
                <legend>Platforms</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {platformOptions.map((platform) => (
                    <label key={platform} className="flex items-center gap-2 rounded-md border border-white/10 bg-black px-3 py-2">
                      <input name="platforms" type="checkbox" value={platform} defaultChecked={platforms.includes(platform)} />
                      {platform}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="flex items-center gap-2 text-sm font-bold text-white/80">
                <input name="guidelinesAccepted" type="checkbox" defaultChecked={Boolean(profile?.guidelinesAcceptedAt)} required />
                I agree to be part of the Electric Crew community in good faith.
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
            {setupComplete && isApproved ? (
              <Link href="/add-post" className="ec-button-cyan mt-4 inline-flex px-4 py-3 font-black">
                Add post
              </Link>
            ) : null}
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
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[color:var(--ec-muted)]">{post.body}</p>
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
