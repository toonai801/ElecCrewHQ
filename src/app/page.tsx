import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { PostCard } from "@/components/post-card";
import { Section } from "@/components/section";
import { discordInviteUrl, galleryItems, sampleEvents, samplePosts } from "@/lib/sample-data";

export default function Home() {
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-yellow-200">
            Official Electric Crew VR
          </p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">
            A safer Electric Crew social layer
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">
            The home base for Electric Crew VR events, approved community posts,
            flyer drops, VR photos, Discord connection, and admin-only beta tools.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-white/70">
            Built like the community page first: clear, moderated, social, and
            ready for TOON/admin beta access before public member posting opens.
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/community" className="rounded-md bg-white px-4 py-2 font-bold text-black hover:bg-yellow-200">
                Explore Community
              </Link>
              <Link href="/events" className="rounded-md border border-yellow-300/35 px-4 py-2 font-bold text-yellow-100 hover:bg-yellow-300/10">
                View Events
              </Link>
              <a href={discordInviteUrl} target="_blank" rel="noreferrer" className="rounded-md border border-cyan-200/40 px-4 py-2 font-bold text-cyan-100 hover:bg-cyan-300/10">
                Join Discord
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/45 p-5 text-sm leading-6 text-white/70">
            MEMBER posts will queue for approval after beta. TRUSTED_CREW can
            auto-approve. Mods and admins can approve, reject, or remove content
            server-side.
          </div>
        </div>
      </section>

      <Section eyebrow="Community feed" title="Approved crew posts">
        <div className="grid gap-5 lg:grid-cols-2">
          {samplePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Featured events" title="Official Electric Crew nights">
        <div className="grid gap-5 lg:grid-cols-2">
          {sampleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Mission" title="VR rave energy with a real community backbone">
        <div className="grid gap-4 md:grid-cols-2">
          <p className="text-lg leading-8 text-white/72">
            Electric Crew VR brings music, creativity, friendship, and inclusion
            into immersive social spaces.
          </p>
          <p className="text-lg leading-8 text-white/72">
            Events, posts, photos, trusted creators, moderation tools, and
            Discord connections all start here as a foundation that can grow
            beyond beta.
          </p>
        </div>
      </Section>

      <Section eyebrow="Gallery preview" title="Flyers and VR photo drops">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.slice(0, 3).map((item) => (
            <div key={item.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="aspect-[4/3] rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }} role="img" aria-label={item.imageAlt || item.title} />
              <p className="mt-3 font-bold text-white">{item.title}</p>
              <p className="text-sm text-yellow-200">{item.tag}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
