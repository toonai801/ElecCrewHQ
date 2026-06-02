"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const reactionTypes = ["LIKE", "LOVE", "HYPE", "LAUGH", "SUPPORT"] as const;

export async function togglePostReaction(formData: FormData) {
  const { session } = await requireRole(["TOON", "ADMIN", "MODERATOR", "TRUSTED_CREW", "MEMBER"]);
  const postId = String(formData.get("postId") || "");
  const type = String(formData.get("type") || "");

  if (!postId || !reactionTypes.includes(type as (typeof reactionTypes)[number])) {
    redirect("/community?error=invalid-reaction");
  }

  const existing = await prisma.postReaction.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: session.user.id,
      },
    },
  });

  if (existing?.type === type) {
    await prisma.postReaction.delete({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    });
  } else {
    await prisma.postReaction.upsert({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
      update: {
        type: type as (typeof reactionTypes)[number],
      },
      create: {
        postId,
        userId: session.user.id,
        type: type as (typeof reactionTypes)[number],
      },
    });
  }

  revalidatePath("/community");
}
