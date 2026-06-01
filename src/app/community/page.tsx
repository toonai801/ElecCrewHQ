import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { auth } from "@/lib/auth";
import { getApprovedCommunityPosts } from "@/lib/content";

export default async function CommunityPage() {
  const [posts, session] = await Promise.all([getApprovedCommunityPosts(), auth()]);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black text-white sm:text-4xl">Electric Crew Social</h2>
          <div className="mt-5 h-px w-28 rounded-full bg-[color:rgba(245,197,66,0.55)]" />
        </div>
        <Link href={session ? "/add-post" : "/login"} className="ec-button-primary px-4 py-2 text-sm">
          Add post
        </Link>
      </div>

      <p className="mx-auto mb-8 max-w-3xl text-lg leading-8 text-[color:var(--ec-muted)]">
        The feed is designed for event info, flyers, VR photos, text updates, links, and tags. During beta, public member posting is locked and must be approved.
      </p>

      <div className="mx-auto grid max-w-3xl gap-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
