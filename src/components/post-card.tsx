import { togglePostReaction } from "@/app/community/actions";
import { postTypeTone } from "@/lib/theme";

type PostCardProps = {
  post: {
    id: string;
    title: string;
    body: string;
    postType: string;
    imageUrl?: string | null;
    imageAlt?: string | null;
    tags: string[];
    author?: { name?: string | null; displayName?: string | null; role?: string | null } | null;
    createdAt: Date;
    reactionCounts?: Record<string, number>;
    viewerReaction?: string | null;
  };
  canReact?: boolean;
};

const reactionLabels = [
  ["LIKE", "Like"],
  ["LOVE", "Love"],
  ["HYPE", "Hype"],
  ["LAUGH", "Laugh"],
  ["SUPPORT", "Support"],
];

export function PostCard({ post, canReact = false }: PostCardProps) {
  return (
    <article className="ec-panel-strong ec-accent-community ec-card-hover ec-hud rounded-lg p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className={postTypeTone[post.postType] || "ec-badge-cyan"}>
          {post.postType}
        </span>
        <span className="ec-text-soft text-xs">
          {post.author?.displayName || post.author?.name || "Electric Crew"} - {post.createdAt.toLocaleDateString()}
        </span>
      </div>
      {post.imageUrl ? (
        <div className="mb-4 rounded-md border border-white/10 bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt={post.imageAlt || post.title}
            className="h-auto max-h-[900px] w-full rounded-md object-contain saturate-150"
            loading="lazy"
          />
        </div>
      ) : null}
      <h3 className="text-xl font-black text-white">{post.title}</h3>
      <p className="ec-text-muted mt-3 text-sm leading-6">{post.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-[color:var(--ec-border)] px-2 py-1 text-xs text-[color:var(--ec-muted-soft)]"
          >
          #{tag}
        </span>
      ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {reactionLabels.map(([type, label]) => {
          const active = post.viewerReaction === type;
          const count = post.reactionCounts?.[type] || 0;

          return canReact ? (
            <form key={type} action={togglePostReaction}>
              <input name="postId" type="hidden" value={post.id} />
              <input name="type" type="hidden" value={type} />
              <button
                className={active ? "rounded-md border border-[color:rgba(57,255,136,0.75)] bg-[color:rgba(57,255,136,0.16)] px-3 py-2 text-xs font-black text-[color:var(--ec-green)]" : "ec-button-ghost px-3 py-2 text-xs font-black"}
                type="submit"
              >
                {label} {count}
              </button>
            </form>
          ) : (
            <span key={type} className="rounded-md border border-white/10 px-3 py-2 text-xs font-black text-white/60">
              {label} {count}
            </span>
          );
        })}
      </div>
    </article>
  );
}
