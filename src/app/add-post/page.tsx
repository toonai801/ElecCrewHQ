import Link from "next/link";
import { CommunityPostForm } from "@/components/community-post-form";
import { Section } from "@/components/section";
import { requireRole } from "@/lib/permissions";

export default async function AddPostPage() {
  await requireRole(["TOON", "ADMIN", "MODERATOR", "TRUSTED_CREW", "MEMBER"]);

  return (
    <Section eyebrow="Add post" title="Create a community post">
      <div className="mb-6">
        <Link href="/community" className="font-bold text-[color:var(--ec-cyan)] hover:text-white">
          Back to community feed
        </Link>
      </div>
      <div className="mx-auto max-w-3xl">
        <CommunityPostForm />
      </div>
    </Section>
  );
}
