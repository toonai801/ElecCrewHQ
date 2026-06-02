"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const rsvpStatuses = ["GOING", "MAYBE", "SADLY_NO"] as const;

export async function setEventRsvp(formData: FormData) {
  const { session } = await requireRole(["TOON", "ADMIN", "MODERATOR", "TRUSTED_CREW", "MEMBER"]);
  const eventId = String(formData.get("eventId") || "");
  const status = String(formData.get("status") || "");
  const slug = String(formData.get("slug") || "");

  if (!eventId || !rsvpStatuses.includes(status as (typeof rsvpStatuses)[number])) {
    redirect("/events?error=invalid-rsvp");
  }

  await prisma.eventRsvp.upsert({
    where: {
      eventId_userId: {
        eventId,
        userId: session.user.id,
      },
    },
    update: {
      status: status as (typeof rsvpStatuses)[number],
    },
    create: {
      eventId,
      userId: session.user.id,
      status: status as (typeof rsvpStatuses)[number],
    },
  });

  revalidatePath("/events");
  if (slug) {
    revalidatePath(`/events/${slug}`);
  }
}
