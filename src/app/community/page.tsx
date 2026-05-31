import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { Section } from "@/components/section";
import { samplePosts } from "@/lib/sample-data";

export default function CommunityPage() {
  return (
    <Section eyebrow="Community feed" title="A safer Electric Crew social layer">
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <p className="ec-text-muted text-lg leading-8">
          The feed is designed for event info, flyers, VR photos, text updates, links, and tags. During beta, public member posting is locked.
        </p>
        <div className="ec-panel rounded-lg p-5 text-sm leading-6 text-[color:var(--ec-muted)]">
          MEMBER posts default to pending after beta. TRUSTED_CREW can auto-approve. Mods and admins can approve, reject, or remove content server-side.
          <div className="mt-4">
            <Link href="/account" className="ec-button-primary px-4 py-2 text-sm">
              Account dashboard
            </Link>
          </div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {samplePosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </Section>
  );
}
