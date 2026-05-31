import Link from "next/link";
import { Radio, Sparkles, Users, Zap } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { PostCard } from "@/components/post-card";
import { Section } from "@/components/section";
import { discordInviteUrl, galleryItems, sampleEvents, samplePosts } from "@/lib/sample-data";

export default function Home() {
  return (
    <>
      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-yellow-200">Official Electric Crew VR</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] text-white sm:text-7xl">
            Electric Crew VR
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
            A neon cyber club community hub for VR events, music, creative drops, trusted crew posts, galleries, and Discord-powered connection.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/events" className="rounded-md bg-yellow-300 px-5 py-3 font-black text-black hover:bg-white">
              View Events
            </Link>
            <a href={discordInviteUrl} target="_blank" rel="noreferrer" className="rounded-md border border-cyan-200/40 px-5 py-3 font-black text-cyan-100 hover:bg-cyan-300/10">
              Join Discord
            </a>
            <Link href="/community" className="rounded-md border border-white/15 px-5 py-3 font-black text-white hover:bg-white/10">
              Explore Community
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_60px_rgba(245,197,66,0.16)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-300 via-cyan-300 to-fuchsia-400" />
          <div className="grid gap-4">
            {[
              { icon: Radio, title: "Official events", copy: "Published Electric Crew sets, flyers, hosts, RSVP links, and Discord announcements." },
              { icon: Users, title: "Safer social feed", copy: "Member submissions, approval queues, trusted posters, and moderator review." },
              { icon: Sparkles, title: "Gallery drops", copy: "Approved flyers, VR photos, and recap images organized for the community." },
              { icon: Zap, title: "Beta locked", copy: "Account areas are built now and restricted to TOON/admin access until launch." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-black/35 p-4">
                <item.icon className="mb-3 size-6 text-yellow-200" />
                <h2 className="font-black text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="About" title="VR rave energy with a real community backbone">
        <div className="grid gap-4 md:grid-cols-2">
          <p className="text-lg leading-8 text-white/72">
            Electric Crew VR brings music, creativity, friendship, and inclusion into immersive social spaces. This hub is built to support the people behind the avatars too.
          </p>
          <p className="text-lg leading-8 text-white/72">
            Events, posts, photos, trusted creators, moderation tools, and Discord connections all start here as a foundation that can grow beyond beta.
          </p>
        </div>
      </Section>

      <Section eyebrow="Featured events" title="Official Electric Crew nights">
        <div className="grid gap-5 lg:grid-cols-2">
          {sampleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Community" title="Approved crew posts">
        <div className="grid gap-5 lg:grid-cols-2">
          {samplePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
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
