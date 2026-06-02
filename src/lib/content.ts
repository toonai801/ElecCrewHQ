import { prisma } from "@/lib/prisma";

export async function getPublishedEvents(viewerId?: string) {
  try {
    const events = await prisma.officialEvent.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        rsvps: {
          select: {
            status: true,
            userId: true,
          },
        },
      },
      orderBy: [
        { isFeatured: "desc" },
        { eventDate: "asc" },
      ],
    });

    return events.map((event) => {
      const rsvpCounts = event.rsvps.reduce<Record<string, number>>((counts, rsvp) => {
        counts[rsvp.status] = (counts[rsvp.status] || 0) + 1;
        return counts;
      }, {});
      const viewerRsvp = viewerId ? event.rsvps.find((rsvp) => rsvp.userId === viewerId)?.status || null : null;

      return {
        ...event,
        rsvpCounts,
        viewerRsvp,
      };
    });
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string, viewerId?: string) {
  try {
    const event = await prisma.officialEvent.findUnique({
      where: { slug },
      include: {
        rsvps: {
          select: {
            status: true,
            userId: true,
          },
        },
      },
    });

    if (!event) {
      return null;
    }

    const rsvpCounts = event.rsvps.reduce<Record<string, number>>((counts, rsvp) => {
      counts[rsvp.status] = (counts[rsvp.status] || 0) + 1;
      return counts;
    }, {});
    const viewerRsvp = viewerId ? event.rsvps.find((rsvp) => rsvp.userId === viewerId)?.status || null : null;

    return {
      ...event,
      rsvpCounts,
      viewerRsvp,
    };
  } catch {
    return null;
  }
}

export async function getApprovedCommunityPosts(viewerId?: string) {
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
            displayName: true,
            role: true,
          },
        },
        reactions: {
          select: {
            type: true,
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts.map((post) => {
      const reactionCounts = post.reactions.reduce<Record<string, number>>((counts, reaction) => {
        counts[reaction.type] = (counts[reaction.type] || 0) + 1;
        return counts;
      }, {});
      const viewerReaction = viewerId ? post.reactions.find((reaction) => reaction.userId === viewerId)?.type || null : null;

      return {
        ...post,
        reactionCounts,
        viewerReaction,
      };
    });
  } catch {
    return [];
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
    return [];
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
            displayName: true,
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

export async function getAccountProfile(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        displayName: true,
        displayNameSource: true,
        displayNameUpdatedAt: true,
        email: true,
        avatarUrl: true,
        bio: true,
        pronouns: true,
        platforms: true,
        timezone: true,
        onboardingComplete: true,
        guidelinesAcceptedAt: true,
        role: true,
      },
    });
  } catch {
    return null;
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

export async function getModeratorRecommendationsForAdmin() {
  try {
    return await prisma.moderatorRecommendation.findMany({
      include: {
        moderator: {
          select: { name: true, email: true, role: true },
        },
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        reviewedBy: {
          select: { name: true, email: true },
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

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();

    return Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
  } catch {
    return {};
  }
}

export async function getGalleryItems() {
  try {
    const galleryPosts = await prisma.communityPost.findMany({
      where: {
        status: "APPROVED",
        visibility: "PUBLIC",
        postType: "PHOTO",
        showInGallery: true,
        imageUrl: {
          not: null,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return galleryPosts
      .filter((post) => post.imageUrl)
      .map((post) => ({
        id: `post-${post.id}`,
        title: post.title,
        imageUrl: post.imageUrl || "",
        imageAlt: post.imageAlt || post.title,
        tag: "Community photo",
      }));
  } catch {
    return [];
  }
}
