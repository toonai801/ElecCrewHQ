import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ImageIcon,
  MessageCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { EventCard } from "@/components/event-card";
import { PostCard } from "@/components/post-card";
import { Section } from "@/components/section";
import { getApprovedCommunityPosts, getPublishedEvents, getSiteSettings } from "@/lib/content";
import { discordInviteUrl, galleryItems } from "@/lib/sample-data";

export default async function HomePage() {
  const [events, posts, settings] = await Promise.all([
    getPublishedEvents(),
    getApprovedCommunityPosts(),
    getSiteSettings(),
  ]);
  const inviteUrl = typeof settings.discordInviteUrl === "string" && settings.discordInviteUrl ? settings.discordInviteUrl : discordInviteUrl;
  const announcement =
    typeof settings.homepageAnnouncement === "string" && settings.homepageAnnouncement
      ? settings.homepageAnnouncement
      : null;

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="ec-stage ec-spectrum-border rounded-lg border border-white/10 bg-black/45">
          <div className="relative z-10 grid min-h-[680px] gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
            <div className="flex flex-col justify-between gap-10">
              <div>
                <div className="mb-7 flex flex-wrap items-center gap-3">
                  <span className="ec-hud border border-[color:rgba(245,197,66,0.55)] bg-[color:rgba(245,197,66,0.12)] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[color:var(--ec-gold)]">
                    Official Electric Crew VR
                  </span>
                  <span className="ec-hud border border-[color:rgba(57,255,136,0.42)] bg-[color:rgba(57,255,136,0.09)] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--ec-green)]">
                    Admin beta online
                  </span>
                </div>

                <h1 className="max-w-5xl text-5xl font-black leading-[0.92] text-white sm:text-7xl lg:text-8xl">
                  Electric Crew <span className="ec-spectrum-text">VR</span>
                </h1>
                <div className="mt-6 max-w-3xl space-y-4 text-xl leading-9 text-white/78">
                  <p>A colorful VR community powered by friendship, chaos, music, gaming, and unapologetic self-expression.</p>
                  <p>Electric Crew VR is an LGBTQ+ forward community built for people who want more than just another VR group. We create spaces where everyone can vibe, laugh, dance, game, socialize, and feel welcome exactly as they are.</p>
                  <p>From late-night hangouts and movie nights to live DJs, community events, dance floors, and unforgettable VR adventures, Electric Crew is all about good energy and genuine connection.</p>
                  <p>Whether you&apos;re here to meet people, express yourself, party with the crew, or just escape reality for a while,
                    you belong here.</p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/events" className="ec-button-primary px-5 py-3">
                    View Events
                  </Link>
                  <a href={inviteUrl} target="_blank" rel="noreferrer" className="ec-button-cyan px-5 py-3 font-black">
                    Join Discord
                  </a>
                  <Link href="/community" className="ec-button-ghost px-5 py-3 font-black">
                    Explore Community
                  </Link>
                </div>
              </div>

              {announcement ? (
                <div className="ec-hud border border-[color:rgba(57,255,136,0.35)] bg-[color:rgba(57,255,136,0.08)] p-4 text-sm font-bold leading-6 text-white/80">
                  {announcement}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Mode", value: "Beta", tone: "text-[color:var(--ec-green)]" },
                  { label: "Posting", value: "Moderated", tone: "text-[color:var(--ec-violet)]" },
                  { label: "Signal", value: "Discord", tone: "text-[color:var(--ec-cyan)]" },
                ].map((item) => (
                  <div key={item.label} className="ec-hud border border-white/10 bg-black/50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">{item.label}</p>
                    <p className={`mt-2 text-2xl font-black ${item.tone}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-rows-[1fr_auto]">
              <div className="ec-hud relative min-h-[360px] overflow-hidden border border-white/10 bg-black">
                <Image
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80"
                  alt="Neon concert lights over a dance floor"
                  fill
                  priority
                  className="object-cover opacity-70 saturate-150"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="mb-4 grid grid-cols-7 gap-1">
                    {[
                      "bg-[color:var(--ec-red)]",
                      "bg-[color:var(--ec-orange)]",
                      "bg-[color:var(--ec-yellow)]",
                      "bg-[color:var(--ec-green)]",
                      "bg-[color:var(--ec-cyan)]",
                      "bg-[color:var(--ec-blue)]",
                      "bg-[color:var(--ec-magenta)]",
                    ].map((color) => (
                      <span key={color} className={`h-1.5 rounded-full ${color}`} />
                    ))}
                  </div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-white/60">
                    Live crew signal
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    Music. Worlds. Photos. Chosen family.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: CalendarDays, label: "Events", value: "Official nights and RSVP links", accent: "ec-accent-events", iconColor: "text-[color:var(--ec-orange)]" },
                  { icon: MessageCircle, label: "Discord", value: "Invite and announcement ready", accent: "ec-accent-discord", iconColor: "text-[color:var(--ec-blue)]" },
                  { icon: Users, label: "Community", value: "Moderated feed foundation", accent: "ec-accent-community", iconColor: "text-[color:var(--ec-violet)]" },
                  { icon: ImageIcon, label: "Gallery", value: "Flyers and VR photo drops", accent: "ec-accent-gallery", iconColor: "text-[color:var(--ec-magenta)]" },
                ].map((item) => (
                  <div key={item.label} className={`ec-panel ec-card-hover ec-hud rounded-lg p-5 ${item.accent}`}>
                    <item.icon className={`mb-4 size-6 ${item.iconColor}`} />
                    <h2 className="font-black text-white">{item.label}</h2>
                    <p className="ec-text-muted mt-2 text-sm leading-6">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Community feed" title="Featured approved posts">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: ShieldCheck, label: "Safer posting", copy: "Member posts queue for approval after beta.", accent: "ec-accent-trusted" },
            { icon: Radio, label: "Crew updates", copy: "Events, flyers, VR photos, links, and tags.", accent: "ec-accent-community" },
            { icon: Sparkles, label: "Trusted signal", copy: "TRUSTED_CREW can auto-approve when unlocked.", accent: "ec-accent-gallery" },
          ].map((item) => (
            <div key={item.label} className={`ec-panel ec-hud rounded-lg p-5 ${item.accent}`}>
              <item.icon className="mb-3 size-5 text-white" />
              <h3 className="font-black text-white">{item.label}</h3>
              <p className="ec-text-muted mt-2 text-sm leading-6">{item.copy}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Official events" title="Electric Crew nights">
        <div className="grid gap-5 lg:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Gallery" title="Flyers and VR photo drops">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.slice(0, 3).map((item) => (
            <a key={item.id} href={item.imageUrl} target="_blank" rel="noreferrer" className="ec-panel ec-accent-gallery ec-card-hover ec-hud group rounded-lg p-3">
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image src={item.imageUrl} alt={item.imageAlt || item.title} fill className="object-cover saturate-150 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
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
