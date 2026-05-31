import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ImageIcon, MessageCircle, ShieldCheck } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { PostCard } from "@/components/post-card";
import { Section } from "@/components/section";
import { discordInviteUrl, galleryItems, sampleEvents, samplePosts } from "@/lib/sample-data";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-yellow-200">
              Official Electric Crew VR
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">
              Dark neon home base for the crew, the events, and the afterglow.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">
              Electric Crew VR is building a safer community hub for official
              events, approved posts, flyer drops, VR photos, Discord updates,
              and admin-only beta tools.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
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

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: CalendarDays, label: "Official events", value: "Published nights, hosts, worlds, RSVP links" },
              { icon: ShieldCheck, label: "Beta locked", value: "Admin access first, public posting later" },
              { icon: MessageCircle, label: "Discord connected", value: "Invite buttons and webhook-ready events" },
              { icon: ImageIcon, label: "Gallery ready", value: "Approved flyers and VR photo drops" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <item.icon className="mb-4 size-6 text-yellow-200" />
                <h2 className="font-black text-white">{item.label}</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="Community feed" title="Featured approved posts">
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <p className="text-lg leading-8 text-white/72">
            The community layer is built for event info, flyers, VR photos, text
            updates, links, and tags, with approval workflows ready for beta.
          </p>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-white/70">
            MEMBER posts queue for review after beta. TRUSTED_CREW can
            auto-approve. Mods and admins can approve, reject, or remove content
            server-side.
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {samplePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Official events" title="Electric Crew nights">
        <div className="grid gap-5 lg:grid-cols-2">
          {sampleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Gallery" title="Flyers and VR photo drops">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.slice(0, 3).map((item) => (
            <a key={item.id} href={item.imageUrl} target="_blank" rel="noreferrer" className="group rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image src={item.imageUrl} alt={item.imageAlt || item.title} fill className="object-cover group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
              </div>
              <p className="mt-3 font-bold text-white">{item.title}</p>
              <p className="text-sm text-cyan-100">{item.tag}</p>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
