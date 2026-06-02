import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  const toonEmail = process.env.BETA_ALLOWED_EMAILS?.split(",")[0]?.trim() || "toon@example.com";

  const toon = await prisma.user.upsert({
    where: { email: toonEmail },
    update: {
      role: "TOON",
      displayName: "TOON",
      displayNameSource: "ADMIN_OVERRIDE",
      displayNameUpdatedAt: new Date(),
      isBetaAllowed: true,
      isApproved: true,
      isActive: true,
      isBanned: false,
      onboardingComplete: true,
    },
    create: {
      email: toonEmail,
      name: "TOON",
      displayName: "TOON",
      displayNameSource: "ADMIN_OVERRIDE",
      displayNameUpdatedAt: new Date(),
      role: "TOON",
      isBetaAllowed: true,
      isApproved: true,
      isActive: true,
      isBanned: false,
      onboardingComplete: true,
      guidelinesAcceptedAt: new Date(),
      profileSlug: "toon",
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "betaLockEnabled" },
    update: { value: process.env.BETA_LOCK_ENABLED ?? "true" },
    create: { key: "betaLockEnabled", value: process.env.BETA_LOCK_ENABLED ?? "true" },
  });

  await prisma.officialEvent.upsert({
    where: { slug: "neon-surge-friday" },
    update: {},
    create: {
      title: "Neon Surge Friday",
      slug: "neon-surge-friday",
      description: "Weekly Electric Crew VR rave with rotating DJs, photos, and Discord hangout.",
      eventTag: "Party",
      eventDate: new Date("2026-06-05T20:00:00-06:00"),
      location: "Electric Crew Main Stage VR World",
      host: "TOON and guest DJs",
      flyerImageUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
      flyerAlt: "Neon concert lights over a crowded dance floor",
      discordUrl: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL,
      rsvpUrl: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL,
      isOfficial: true,
      isFeatured: true,
      status: "PUBLISHED",
      createdById: toon.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
