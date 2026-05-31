import Image from "next/image";
import { postTypeTone } from "@/lib/theme";

type PostCardProps = {
  post: {
    title: string;
    body: string;
    postType: string;
    imageUrl?: string | null;
    imageAlt?: string | null;
    tags: string[];
    author?: { name?: string | null; role?: string | null } | null;
    createdAt: Date;
  };
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="ec-panel-strong rounded-lg p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className={postTypeTone[post.postType] || "ec-badge-cyan"}>{post.postType}</span>
        <span className="ec-text-soft text-xs">
          {post.author?.name || "Electric Crew"} · {post.createdAt.toLocaleDateString()}
        </span>
      </div>
      {post.imageUrl ? (
        <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-md">
          <Image src={post.imageUrl} alt={post.imageAlt || post.title} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      ) : null}
      <h3 className="text-xl font-black text-white">{post.title}</h3>
      <p className="ec-text-muted mt-3 text-sm leading-6">{post.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-md border border-[color:var(--ec-border)] px-2 py-1 text-xs text-[color:var(--ec-muted-soft)]">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
