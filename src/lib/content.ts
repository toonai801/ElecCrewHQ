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

export async function getAllCommunityPostsForAdmin() {
  try {
    return await prisma.communityPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch {
    return [];
  }
}

export async function getMyCommunityPosts(userId: string) {
  try {
    return await prisma.communityPost.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch {
    return [];
  }
}

export async function getAllUsersForAdmin() {
  try {
    return await prisma.user.findMany({
      orderBy: [
        { role: "asc" },
        { createdAt: "desc" },
      ],
    });
  } catch {
    return [];
  }
}

export async function getGalleryItems() {
  const approvedPosts = await getApprovedCommunityPosts();
  const publishedEvents = await getPublishedEvents();

  return [
    ...publishedEvents
      .filter((event) => event.flyerImageUrl)
      .map((event) => ({
        id: `event-${event.id}`,
        title: event.title,
        imageUrl: event.flyerImageUrl,
        imageAlt: event.flyerAlt || event.title,
        tag: "Official event",
      })),
    ...approvedPosts
      .filter((post) => post.imageUrl)
      .map((post) => ({
        id: `post-${post.id}`,
        title: post.title,
        imageUrl: post.imageUrl || "",
        imageAlt: post.imageAlt || post.title,
        tag: post.postType,
      })),
  ];
}
