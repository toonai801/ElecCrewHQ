import { Section } from "@/components/section";
import { getAllCommunityPostsForAdmin } from "@/lib/content";
import { requireRole } from "@/lib/permissions";
import { deleteCommunityPost, updateCommunityPostStatus } from "@/app/admin/community/actions";

export default async function AdminCommunityPage() {
  await requireRole(["TOON", "ADMIN", "MODERATOR"]);
  const posts = await getAllCommunityPostsForAdmin();

  return (
    <Section eyebrow="Admin community" title="Community moderation">
      <div className="grid gap-4">
        {posts.length ? posts.map((post) => (
          <article key={post.id} className="ec-panel ec-accent-community rounded-lg p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--ec-violet)]">
                  {post.postType} - {post.status} - {post.visibility}
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">{post.title}</h2>
                <p className="mt-2 text-sm text-[color:var(--ec-muted)]">
                  By {post.author.name || post.author.email || "Unknown"} on {post.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["PENDING", "APPROVED", "REJECTED"].map((status) => (
                  <form key={status} action={updateCommunityPostStatus}>
                    <input name="id" type="hidden" value={post.id} />
                    <input name="status" type="hidden" value={status} />
                    <button className="ec-button-ghost px-3 py-2 text-xs font-black" type="submit">
                      {status}
                    </button>
                  </form>
                ))}
                <form action={deleteCommunityPost}>
                  <input name="id" type="hidden" value={post.id} />
                  <button className="rounded-md border border-[color:rgba(255,75,75,0.45)] px-3 py-2 text-xs font-black text-[color:var(--ec-red)]" type="submit">
                    Delete
                  </button>
                </form>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[color:var(--ec-muted)]">{post.body}</p>
            {post.imageUrl ? <p className="mt-3 text-sm text-[color:var(--ec-magenta)]">{post.imageUrl}</p> : null}
            {post.externalUrl ? <p className="mt-3 text-sm text-[color:var(--ec-cyan)]">{post.externalUrl}</p> : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/60">
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        )) : (
          <div className="ec-panel rounded-lg p-5 text-[color:var(--ec-muted)]">No community posts yet.</div>
        )}
      </div>
    </Section>
  );
}
