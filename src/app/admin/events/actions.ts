"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { announceOfficialEvent } from "@/lib/discord";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { officialEventSchema } from "@/lib/validators";

const fallbackFlyer =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";

export async function createOfficialEvent(formData: FormData) {
  const { session } = await requireRole(["TOON", "ADMIN"]);

  const parsed = officialEventSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    eventTag: formData.get("eventTag") || "Community Event",
    eventDate: formData.get("eventDate"),
    location: formData.get("location"),
    host: formData.get("host"),
    flyerImageUrl: formData.get("flyerImageUrl"),
    flyerAlt: formData.get("flyerAlt"),
    discordUrl: formData.get("discordUrl"),
    rsvpUrl: formData.get("rsvpUrl"),
    isOfficial: formData.get("isOfficial") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    status: formData.get("status") || "DRAFT",
  });

  if (!parsed.success) {
    redirect("/admin/events?error=invalid-event");
  }

  const event = await prisma.officialEvent.create({
    data: {
      ...parsed.data,
      flyerImageUrl: parsed.data.flyerImageUrl || fallbackFlyer,
      flyerAlt: parsed.data.flyerAlt || parsed.data.title,
      discordUrl: parsed.data.discordUrl || null,
      rsvpUrl: parsed.data.rsvpUrl || null,
      createdById: session.user.id,
    },
  });

  if (event.status === "PUBLISHED" && formData.get("announceToDiscord") === "on") {
    await announceOfficialEvent(event);
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events?created=1");
}

export async function updateOfficialEventStatus(formData: FormData) {
  await requireRole(["TOON", "ADMIN"]);

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!id || !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    redirect("/admin/events?error=invalid-status");
  }

  const event = await prisma.officialEvent.update({
    where: { id },
    data: { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" },
  });

  if (status === "PUBLISHED" && formData.get("announceToDiscord") === "on") {
    await announceOfficialEvent(event);
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function updateOfficialEvent(formData: FormData) {
  await requireRole(["TOON", "ADMIN"]);

  const id = String(formData.get("id") || "");
  const parsed = officialEventSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    eventTag: formData.get("eventTag") || "Community Event",
    eventDate: formData.get("eventDate"),
    location: formData.get("location"),
    host: formData.get("host"),
    flyerImageUrl: formData.get("flyerImageUrl"),
    flyerAlt: formData.get("flyerAlt"),
    discordUrl: formData.get("discordUrl"),
    rsvpUrl: formData.get("rsvpUrl"),
    isOfficial: formData.get("isOfficial") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    status: formData.get("status") || "DRAFT",
  });

  if (!id || !parsed.success) {
    redirect("/admin/events?error=invalid-event-update");
  }

  const event = await prisma.officialEvent.update({
    where: { id },
    data: {
      ...parsed.data,
      flyerImageUrl: parsed.data.flyerImageUrl || fallbackFlyer,
      flyerAlt: parsed.data.flyerAlt || parsed.data.title,
      discordUrl: parsed.data.discordUrl || null,
      rsvpUrl: parsed.data.rsvpUrl || null,
    },
  });

  if (event.status === "PUBLISHED" && formData.get("announceToDiscord") === "on") {
    await announceOfficialEvent(event);
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath(`/events/${event.slug}`);
  revalidatePath("/admin/events");
  redirect("/admin/events?updated=1");
}

export async function toggleOfficialEventFeatured(formData: FormData) {
  await requireRole(["TOON", "ADMIN"]);

  const id = String(formData.get("id") || "");
  const isFeatured = formData.get("isFeatured") === "true";

  if (!id) {
    redirect("/admin/events?error=missing-event");
  }

  await prisma.officialEvent.update({
    where: { id },
    data: { isFeatured: !isFeatured },
  });

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function deleteOfficialEvent(formData: FormData) {
  await requireRole(["TOON", "ADMIN"]);

  const id = String(formData.get("id") || "");

  if (!id) {
    redirect("/admin/events?error=missing-event");
  }

  await prisma.officialEvent.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}
