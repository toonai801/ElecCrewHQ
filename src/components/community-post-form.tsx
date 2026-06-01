import { createCommunityPost } from "@/app/account/actions";
import { communityTagOptions } from "@/lib/validators";
import { ImageUploadField } from "@/components/image-upload-field";

export function CommunityPostForm({ framed = true }: { framed?: boolean }) {
  return (
    <form action={createCommunityPost} className={framed ? "ec-panel ec-accent-community rounded-lg p-5" : "grid gap-4"}>
      {framed ? <h2 className="text-xl font-black text-white">Add community post</h2> : null}
      <div className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-white/80">
          Title
          <input name="title" required className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-violet)]" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white/80">
          Post type
          <select name="postType" className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-violet)]">
            {["EVENT", "FLYER", "PHOTO", "TEXT", "LINK"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-white/80">
          Body
          <textarea name="body" required className="min-h-32 rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-violet)]" />
        </label>
        <ImageUploadField name="imageUrl" label="Post image" accent="var(--ec-violet)" />
        <label className="grid gap-2 text-sm font-bold text-white/80">
          Image alt text
          <input name="imageAlt" className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-violet)]" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white/80">
          External link
          <input name="externalUrl" type="url" className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-violet)]" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white/80">
          Tag
          <select name="tags" required className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-violet)]">
            {communityTagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-white/80">
          Visibility
          <select name="visibility" className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-violet)]">
            <option value="PUBLIC">Public</option>
            <option value="MEMBERS_ONLY">Members only</option>
          </select>
        </label>
        <button className="ec-button-cyan px-4 py-3 font-black" type="submit">
          Submit post
        </button>
      </div>
    </form>
  );
}
