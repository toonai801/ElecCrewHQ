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
            <p className="ec-eyebrow">
              Official Electric Crew VR
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">
              Dark neon home base for the crew, the events, and the afterglow.
            </h1>
            <p className="ec-text-muted mt-5 max-w-3xl text-lg leading-8">
              Electric Crew VR is building a safer community hub for official
              events, approved posts, flyer drops, VR photos, Discord updates,
              and admin-only beta tools.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/events" className="ec-button-primary px-5 py-3">
                View Events
              </Link>
              <a href={discordInviteUrl} target="_blank" rel="noreferrer" className="ec-button-cyan px-5 py-3 font-black">
                Join Discord
              </a>
              <Link href="/community" className="ec-button-ghost px-5 py-3 font-black">
                Explore Community
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: CalendarDays, label: "Official events", value: "Published nights, hosts, worlds, RSVP links", accent: "ec-accent-events", iconColor: "text-[color:var(--ec-orange)]" },
              { icon: ShieldCheck, label: "Beta locked", value: "Admin access first, public posting later", accent: "ec-accent-trusted", iconColor: "text-[color:var(--ec-green)]" },
              { icon: MessageCircle, label: "Discord connected", value: "Invite buttons and webhook-ready events", accent: "ec-accent-discord", iconColor: "text-[color:var(--ec-blue)]" },
              { icon: ImageIcon, label: "Gallery ready", value: "Approved flyers and VR photo drops", accent: "ec-accent-gallery", iconColor: "text-[color:var(--ec-magenta)]" },
            ].map((item) => (
              <div key={item.label} className={`ec-panel rounded-lg p-5 ${item.accent}`}>
                <item.icon className={`mb-4 size-6 ${item.iconColor}`} />
                <h2 className="font-black text-white">{item.label}</h2>
                <p className="ec-text-muted mt-2 text-sm leading-6">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="Community feed" title="Featured approved posts">
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <p className="ec-text-muted text-lg leading-8">
            The community layer is built for event info, flyers, VR photos, text
            updates, links, and tags, with approval workflows ready for beta.
          </p>
          <div className="ec-panel ec-accent-community rounded-lg p-5 text-sm leading-6 text-[color:var(--ec-muted)]">
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
            <a key={item.id} href={item.imageUrl} target="_blank" rel="noreferrer" className="ec-panel ec-accent-gallery group rounded-lg p-3">
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image src={item.imageUrl} alt={item.imageAlt || item.title} fill className="object-cover group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
              </div>
              <p className="mt-3 font-bold text-white">{item.title}</p>
              <p className="text-sm text-[color:var(--ec-magenta)]">{item.tag}</p>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
