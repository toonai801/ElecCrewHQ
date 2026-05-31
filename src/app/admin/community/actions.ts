"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canModeratePosts, requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function updateCommunityPostStatus(formData: FormData) {
  const { session, role } = await requireRole(["TOON", "ADMIN", "MODERATOR"]);

  if (!canModeratePosts(role)) {
    redirect("/admin?error=forbidden");
  }

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!id || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    redirect("/admin/community?error=invalid-status");
  }

  await prisma.communityPost.update({
    where: { id },
    data: {
      status: status as "PENDING" | "APPROVED" | "REJECTED",
      approvedAt: status === "APPROVED" ? new Date() : null,
      approvedById: status === "APPROVED" ? session.user.id : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/community");
  revalidatePath("/gallery");
  revalidatePath("/admin/community");
}

export async function deleteCommunityPost(formData: FormData) {
  const { role } = await requireRole(["TOON", "ADMIN", "MODERATOR"]);

  if (!canModeratePosts(role)) {
    redirect("/admin?error=forbidden");
  }

  const id = String(formData.get("id") || "");

  if (!id) {
    redirect("/admin/community?error=missing-post");
  }

  await prisma.communityPost.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/community");
  revalidatePath("/gallery");
  revalidatePath("/admin/community");
}
