"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

const editableKeys = [
  "discordInviteUrl",
  "discordWidgetId",
  "communityPostingLocked",
  "trustedCrewAutoApprove",
  "homepageAnnouncement",
] as const;

export async function updateSiteSettings(formData: FormData) {
  await requireRole(["TOON", "ADMIN"]);

  await Promise.all(
    editableKeys.map((key) => {
      const raw = formData.get(key);
      const value =
        key === "communityPostingLocked" || key === "trustedCrewAutoApprove"
          ? raw === "on"
          : String(raw || "").trim();

      return prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }),
  );

  revalidatePath("/");
  revalidatePath("/discord");
  revalidatePath("/community");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?updated=1");
}
