"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canAutoApprovePosts, requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { communityPostSchema, profileSchema } from "@/lib/validators";

export async function updateProfile(formData: FormData) {
  const { session } = await requireRole(["TOON", "ADMIN", "MODERATOR", "TRUSTED_CREW", "MEMBER"]);

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    avatarUrl: formData.get("avatarUrl"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    redirect("/account?error=invalid-profile");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      avatarUrl: parsed.data.avatarUrl || null,
      bio: parsed.data.bio || null,
    },
  });

  revalidatePath("/account");
  redirect("/account?profile=updated");
}

export async function createCommunityPost(formData: FormData) {
  const { session, role } = await requireRole(["TOON", "ADMIN", "MODERATOR", "TRUSTED_CREW", "MEMBER"]);

  const parsed = communityPostSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    postType: formData.get("postType"),
    imageUrl: formData.get("imageUrl"),
    imageAlt: formData.get("imageAlt"),
    externalUrl: formData.get("externalUrl"),
    tags: formData.get("tags") || "",
    visibility: formData.get("visibility") || "PUBLIC",
  });

  if (!parsed.success) {
    redirect("/account?error=invalid-post");
  }

  const autoApproved = canAutoApprovePosts(role);

  await prisma.communityPost.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      postType: parsed.data.postType,
      imageUrl: parsed.data.imageUrl || null,
      imageAlt: parsed.data.imageAlt || null,
      externalUrl: parsed.data.externalUrl || null,
      tags: parsed.data.tags,
      visibility: parsed.data.visibility,
      status: autoApproved ? "APPROVED" : "PENDING",
      approvedAt: autoApproved ? new Date() : null,
      approvedById: autoApproved ? session.user.id : null,
      authorId: session.user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/community");
  revalidatePath("/gallery");
  revalidatePath("/account");
  redirect(autoApproved ? "/account?post=approved" : "/account?post=pending");
}

export async function deleteOwnPendingPost(formData: FormData) {
  const { session } = await requireRole(["TOON", "ADMIN", "MODERATOR", "TRUSTED_CREW", "MEMBER"]);
  const id = String(formData.get("id") || "");

  if (!id) {
    redirect("/account?error=missing-post");
  }

  await prisma.communityPost.deleteMany({
    where: {
      id,
      authorId: session.user.id,
      status: "PENDING",
    },
  });

  revalidatePath("/account");
  redirect("/account?post=deleted");
}
