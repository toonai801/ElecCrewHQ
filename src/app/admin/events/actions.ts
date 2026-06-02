"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { announceOfficialEvent } from "@/lib/discord";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { officialEventSchema } from "@/lib/validators";

const fallbackFlyer =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";

function normalizeSlug(value: FormDataEntryValue | null, fallback: FormDataEntryValue | null) {
  const source = String(value || fallback || "");

  return source
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function eventFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: normalizeSlug(formData.get("slug"), formData.get("title")),
    description: formData.get("description"),
    eventTag: formData.get("eventTag") || "Community Event",
    eventDate: formData.get("eventDate"),
    eventEndDate: formData.get("eventEndDate"),
    location: formData.get("location"),
    host: formData.get("host"),
    flyerImageUrl: formData.get("flyerImageUrl"),
    flyerAlt: formData.get("flyerAlt"),
    discordUrl: formData.get("discordUrl"),
    rsvpUrl: formData.get("rsvpUrl"),
    isOfficial: formData.get("isOfficial") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    status: formData.get("status") || "DRAFT",
  };
}

function validationErrorRedirect(baseError: string, parsed: ReturnType<typeof officialEventSchema.safeParse>): never {
  if (parsed.success) {
    redirect(`/admin/events?error=${baseError}`);
  }

  const field = String(parsed.error.issues[0]?.path[0] || "event");
  redirect(`/admin/events?error=${baseError}&field=${encodeURIComponent(field)}`);
}

function databaseErrorRedirect(baseError: string, error: unknown): never {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
    redirect("/admin/events?error=duplicate-slug");
  }

  console.error(baseError, error);
  redirect(`/admin/events?error=${baseError}`);
}

export async function createOfficialEvent(formData: FormData) {
  const { session } = await requireRole(["TOON", "ADMIN"]);

  const parsed = officialEventSchema.safeParse(eventFormData(formData));

  if (!parsed.success) {
    validationErrorRedirect("invalid-event", parsed);
  }

  let event;
  try {
    event = await prisma.officialEvent.create({
      data: {
        ...parsed.data,
        eventEndDate: parsed.data.eventEndDate || null,
        flyerImageUrl: parsed.data.flyerImageUrl || fallbackFlyer,
        flyerAlt: parsed.data.flyerAlt || parsed.data.title,
        discordUrl: parsed.data.discordUrl || null,
        rsvpUrl: parsed.data.rsvpUrl || null,
        createdById: session.user.id,
      },
    });
  } catch (error) {
    databaseErrorRedirect("create-event-failed", error);
  }

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
  const parsed = officialEventSchema.safeParse(eventFormData(formData));

  if (!id) {
    redirect("/admin/events?error=missing-event");
  }

  if (!parsed.success) {
    validationErrorRedirect("invalid-event-update", parsed);
  }

  let event;
  try {
    event = await prisma.officialEvent.update({
      where: { id },
      data: {
        ...parsed.data,
        eventEndDate: parsed.data.eventEndDate || null,
        flyerImageUrl: parsed.data.flyerImageUrl || fallbackFlyer,
        flyerAlt: parsed.data.flyerAlt || parsed.data.title,
        discordUrl: parsed.data.discordUrl || null,
        rsvpUrl: parsed.data.rsvpUrl || null,
      },
    });
  } catch (error) {
    databaseErrorRedirect("update-event-failed", error);
  }

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
