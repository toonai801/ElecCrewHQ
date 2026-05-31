import Image from "next/image";

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
    <article className="rounded-lg border border-white/10 bg-black/45 p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-cyan-300/15 px-2.5 py-1 text-xs font-bold text-cyan-100">{post.postType}</span>
        <span className="text-xs text-white/50">
          {post.author?.name || "Electric Crew"} · {post.createdAt.toLocaleDateString()}
        </span>
      </div>
      {post.imageUrl ? (
        <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-md">
          <Image src={post.imageUrl} alt={post.imageAlt || post.title} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      ) : null}
      <h3 className="text-xl font-black text-white">{post.title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/70">{post.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/60">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
