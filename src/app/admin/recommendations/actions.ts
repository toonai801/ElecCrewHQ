"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

export async function createTrustedCrewRecommendation(formData: FormData) {
  const { session } = await requireRole(["TOON", "ADMIN", "MODERATOR"]);
  const userId = String(formData.get("userId") || "");
  const reason = String(formData.get("reason") || "").trim();

  if (!userId || reason.length < 8) {
    redirect("/admin/recommendations?error=invalid-recommendation");
  }

  await prisma.moderatorRecommendation.create({
    data: {
      moderatorId: session.user.id,
      userId,
      reason,
    },
  });

  revalidatePath("/admin/recommendations");
  redirect("/admin/recommendations?created=1");
}

export async function reviewTrustedCrewRecommendation(formData: FormData) {
  const { session } = await requireRole(["TOON", "ADMIN"]);
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!id || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
    redirect("/admin/recommendations?error=invalid-review");
  }

  const recommendation = await prisma.moderatorRecommendation.update({
    where: { id },
    data: {
      status: status as "APPROVED" | "REJECTED" | "PENDING",
      reviewedById: status === "PENDING" ? null : session.user.id,
    },
    include: { user: true },
  });

  if (status === "APPROVED" && recommendation.user.role === "MEMBER") {
    await prisma.user.update({
      where: { id: recommendation.userId },
      data: { role: "TRUSTED_CREW", isBetaAllowed: true },
    });
  }

  revalidatePath("/admin/recommendations");
  revalidatePath("/admin/users");
}
