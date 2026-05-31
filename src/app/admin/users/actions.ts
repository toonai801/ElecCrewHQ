"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const roles = ["TOON", "ADMIN", "MODERATOR", "TRUSTED_CREW", "MEMBER"] as const;

export async function updateUserRole(formData: FormData) {
  const { session } = await requireRole(["TOON", "ADMIN"]);
  const id = String(formData.get("id") || "");
  const role = String(formData.get("role") || "");

  if (!id || !roles.includes(role as (typeof roles)[number])) {
    redirect("/admin/users?error=invalid-role");
  }

  const target = await prisma.user.findUnique({ where: { id } });

  if (!target || target.role === "TOON" || role === "TOON" || target.id === session.user.id) {
    redirect("/admin/users?error=toon-protected");
  }

  await prisma.user.update({
    where: { id },
    data: { role: role as (typeof roles)[number] },
  });

  revalidatePath("/admin/users");
}

export async function toggleUserBetaAccess(formData: FormData) {
  await requireRole(["TOON", "ADMIN"]);
  const id = String(formData.get("id") || "");
  const current = formData.get("current") === "true";

  if (!id) {
    redirect("/admin/users?error=missing-user");
  }

  const target = await prisma.user.findUnique({ where: { id } });

  if (!target || target.role === "TOON") {
    redirect("/admin/users?error=toon-protected");
  }

  await prisma.user.update({
    where: { id },
    data: { isBetaAllowed: !current },
  });

  revalidatePath("/admin/users");
}

export async function toggleUserActive(formData: FormData) {
  await requireRole(["TOON", "ADMIN"]);
  const id = String(formData.get("id") || "");
  const current = formData.get("current") === "true";

  if (!id) {
    redirect("/admin/users?error=missing-user");
  }

  const target = await prisma.user.findUnique({ where: { id } });

  if (!target || target.role === "TOON") {
    redirect("/admin/users?error=toon-protected");
  }

  await prisma.user.update({
    where: { id },
    data: { isActive: !current },
  });

  revalidatePath("/admin/users");
}
