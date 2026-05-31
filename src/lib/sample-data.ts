export type RoleName = "TOON" | "ADMIN" | "MODERATOR" | "TRUSTED_CREW" | "MEMBER";
export type EventStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type PostStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PostType = "EVENT" | "FLYER" | "PHOTO" | "TEXT" | "LINK";

export const discordInviteUrl =
  process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/electriccrewvr";

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/mission", label: "Mission" },
  { href: "/events", label: "Events" },
  { href: "/community", label: "Community" },
  { href: "/gallery", label: "Gallery" },
  { href: "/discord", label: "Discord" },
  { href: "/contact", label: "Contact" },
];

export const values = [
  "Inclusive VR dance floors where new people feel welcome fast.",
  "Creative expression through music, worldbuilding, flyers, photos, and performance.",
  "Friendship that continues outside the headset through Discord and real support.",
  "Moderation that keeps the room energetic, safe, and respectful.",
];

export const sampleEvents = [
  {
    id: "neon-surge",
    title: "Neon Surge Friday",
    slug: "neon-surge-friday",
    description:
      "A weekly Electric Crew VR rave with rotating DJs, photo moments, and a hosted after-hang.",
    eventDate: new Date("2026-06-05T20:00:00-06:00"),
    location: "Electric Crew Main Stage VR World",
    host: "TOON and guest DJs",
    flyerImageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    flyerAlt: "Neon concert lights over a crowded dance floor",
    discordUrl: discordInviteUrl,
    rsvpUrl: discordInviteUrl,
    isFeatured: true,
    status: "PUBLISHED" as EventStatus,
  },
  {
    id: "gold-circuit",
    title: "Gold Circuit Open Decks",
    slug: "gold-circuit-open-decks",
    description:
      "Community DJ slots, flyer drops, and a friendly room for crews to connect.",
    eventDate: new Date("2026-06-12T19:30:00-06:00"),
    location: "Electric Crew Clubhouse",
    host: "Electric Crew Mods",
    flyerImageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    flyerAlt: "Stage lights and hands raised at a live music event",
    discordUrl: discordInviteUrl,
    rsvpUrl: discordInviteUrl,
    isFeatured: true,
    status: "PUBLISHED" as EventStatus,
  },
];

export const samplePosts = [
  {
    id: "crew-photo-drop",
    title: "Photo drop from Neon Surge",
    body: "A few favorite moments from the last set. Tag your crew and send more for the gallery.",
    postType: "PHOTO" as PostType,
    imageUrl:
      "https://images.unsplash.com/photo-1571266028243-d220c9c3b19f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Colorful neon lights in a club environment",
    externalUrl: "",
    tags: ["photos", "neon-surge", "vrchat"],
    status: "APPROVED" as PostStatus,
    author: { name: "Electric Crew Team", role: "TOON" as RoleName },
    createdAt: new Date("2026-05-25T18:00:00-06:00"),
  },
  {
    id: "flyer-call",
    title: "Flyer artists wanted",
    body: "We are opening a trusted creator list for flyer art, VR photos, and event recaps.",
    postType: "TEXT" as PostType,
    imageUrl: "",
    imageAlt: "",
    externalUrl: discordInviteUrl,
    tags: ["creative", "trusted-crew"],
    status: "APPROVED" as PostStatus,
    author: { name: "TOON", role: "TOON" as RoleName },
    createdAt: new Date("2026-05-27T12:00:00-06:00"),
  },
];

export const galleryItems = [
  ...sampleEvents.map((event) => ({
    id: `event-${event.id}`,
    title: event.title,
    imageUrl: event.flyerImageUrl,
    imageAlt: event.flyerAlt,
    tag: "Official event",
  })),
  ...samplePosts
    .filter((post) => post.imageUrl)
    .map((post) => ({
      id: `post-${post.id}`,
      title: post.title,
      imageUrl: post.imageUrl,
      imageAlt: post.imageAlt,
      tag: post.postType,
    })),
];
