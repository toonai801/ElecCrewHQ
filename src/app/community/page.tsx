import Link from "next/link";
import { CommunityPostModal } from "@/components/community-post-modal";
import { PostCard } from "@/components/post-card";
import { Section } from "@/components/section";
import { auth } from "@/lib/auth";
import { getApprovedCommunityPosts } from "@/lib/content";

export default async function CommunityPage() {
  const [posts, session] = await Promise.all([getApprovedCommunityPosts(), auth()]);

  return (
    <Section eyebrow="Community feed" title="A safer Electric Crew social layer">
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <p className="ec-text-muted text-lg leading-8">
          The feed is designed for event info, flyers, VR photos, text updates, links, and tags. During beta, public member posting is locked.
        </p>
        <div className="ec-panel ec-accent-community rounded-lg p-5 text-sm leading-6 text-[color:var(--ec-muted)]">
          MEMBER posts default to pending after beta. TRUSTED_CREW can auto-approve. Mods and admins can approve, reject, or remove content server-side.
          <div className="mt-4">
            {session ? <CommunityPostModal /> : (
              <Link href="/login" className="ec-button-primary px-4 py-2 text-sm">
                Add post
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </Section>
  );
}
