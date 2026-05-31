import { prisma } from "@/lib/prisma";
import { sampleEvents, samplePosts } from "@/lib/sample-data";

export async function getPublishedEvents() {
  try {
    const events = await prisma.officialEvent.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: [
        { isFeatured: "desc" },
        { eventDate: "asc" },
      ],
    });

    return events.length ? events : sampleEvents;
  } catch {
    return sampleEvents;
  }
}

export async function getEventBySlug(slug: string) {
  try {
    const event = await prisma.officialEvent.findUnique({
      where: { slug },
    });

    return event ?? sampleEvents.find((item) => item.slug === slug) ?? null;
  } catch {
    return sampleEvents.find((item) => item.slug === slug) ?? null;
  }
}

export async function getApprovedCommunityPosts() {
  try {
    const posts = await prisma.communityPost.findMany({
      where: {
        status: "APPROVED",
        visibility: "PUBLIC",
      },
      include: {
        author: {
          select: {
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts.length ? posts : samplePosts;
  } catch {
    return samplePosts;
  }
}

export async function getAllOfficialEventsForAdmin() {
  try {
    return await prisma.officialEvent.findMany({
      orderBy: [
        { updatedAt: "desc" },
        { eventDate: "asc" },
      ],
    });
  } catch {
    return sampleEvents;
  }
}
