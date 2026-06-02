import { ActionCard } from "@/components/action-card";
import { ImageUploadField } from "@/components/image-upload-field";
import { Section } from "@/components/section";
import { getAllOfficialEventsForAdmin } from "@/lib/content";
import { requireRole } from "@/lib/permissions";
import { eventTagOptions } from "@/lib/validators";
import {
  createOfficialEvent,
  deleteOfficialEvent,
  toggleOfficialEventFeatured,
  updateOfficialEvent,
  updateOfficialEventStatus,
} from "@/app/admin/events/actions";

const inactiveStatusButtonClass = "ec-button-ghost px-3 py-2 text-xs font-black";
const activeFeaturedButtonClass =
  "rounded-md border border-[color:rgba(245,197,66,0.72)] bg-[color:rgba(245,197,66,0.16)] px-3 py-2 text-xs font-black text-[color:var(--ec-gold)] shadow-[0_0_18px_rgba(245,197,66,0.14)]";

const fieldLabels: Record<string, string> = {
  title: "Title",
  slug: "Slug",
  description: "Description",
  eventTag: "Event tag",
  eventDate: "Date and time",
  location: "Location",
  host: "Host/DJ/Performer",
  flyerImageUrl: "Flyer image URL",
  flyerAlt: "Flyer alt text",
  discordUrl: "Discord link",
  rsvpUrl: "RSVP link",
  status: "Status",
};

const errorMessages: Record<string, string> = {
  "invalid-event": "Event was not saved. Check the highlighted field rules and try again.",
  "invalid-event-update": "Event changes were not saved. Check the highlighted field rules and try again.",
  "duplicate-slug": "That slug is already used by another event. Change the slug or leave it blank for a new event.",
  "create-event-failed": "Event was not saved because the database rejected the request.",
  "update-event-failed": "Event changes were not saved because the database rejected the request.",
  "invalid-status": "That status change was not valid.",
  "missing-event": "The event could not be found.",
};

function eventStatusButtonClass(currentStatus: string, buttonStatus: string) {
  if (currentStatus !== buttonStatus) {
    return inactiveStatusButtonClass;
  }

  if (buttonStatus === "PUBLISHED") {
    return "rounded-md border border-[color:rgba(57,255,136,0.75)] bg-[color:rgba(57,255,136,0.20)] px-3 py-2 text-xs font-black text-[color:var(--ec-green)] shadow-[0_0_20px_rgba(57,255,136,0.18)]";
  }

  if (buttonStatus === "ARCHIVED") {
    return "rounded-md border border-white/35 bg-white/10 px-3 py-2 text-xs font-black text-white/85 shadow-[0_0_18px_rgba(255,255,255,0.10)]";
  }

  return activeFeaturedButtonClass;
}

function adminNotice(error?: string, field?: string, success?: string) {
  if (success === "1") {
    return {
      className: "border-[color:rgba(57,255,136,0.45)] bg-[color:rgba(57,255,136,0.10)] text-[color:var(--ec-green)]",
      message: success === "1" ? "Event saved." : "",
    };
  }

  if (!error) {
    return null;
  }

  const fieldName = field ? fieldLabels[field] || field : "";
  const detail = fieldName ? ` Problem field: ${fieldName}.` : "";

  return {
    className: "border-[color:rgba(255,75,75,0.50)] bg-[color:rgba(255,75,75,0.10)] text-[color:var(--ec-red)]",
    message: `${errorMessages[error] || "Something went wrong while saving the event."}${detail}`,
  };
}

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; field?: string; created?: string; updated?: string }>;
}) {
  await requireRole(["TOON", "ADMIN"]);
  const params = await searchParams;
  const notice = adminNotice(params?.error, params?.field, params?.created || params?.updated);
  const events = await getAllOfficialEventsForAdmin();

  return (
    <Section eyebrow="Admin events" title="Event management">
      {notice ? (
        <div className={`mb-5 rounded-lg border px-4 py-3 text-sm font-black ${notice.className}`}>
          {notice.message}
        </div>
      ) : null}
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form action={createOfficialEvent} className="ec-panel ec-accent-events grid gap-4 rounded-lg p-5">
          {[
            ["Title", "title", "text"],
            ["Slug", "slug", "text"],
            ["Date and time", "eventDate", "datetime-local"],
            ["Host/DJ/Performer", "host", "text"],
            ["VR world/location", "location", "text"],
            ["Flyer alt text", "flyerAlt", "text"],
            ["Discord link", "discordUrl", "url"],
            ["RSVP link", "rsvpUrl", "url"],
          ].map(([label, name, type]) => (
            <label key={name} className="grid gap-2 text-sm font-bold text-white/80">
              {label}
              <input
                name={name}
                type={type}
                required={["title", "eventDate", "host", "location"].includes(name)}
                placeholder={name === "slug" ? "Auto-created from title if blank" : undefined}
                pattern={name === "slug" ? "[a-z0-9]+(?:-[a-z0-9]+)*" : undefined}
                className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-orange)]"
              />
              {name === "slug" ? (
                <span className="text-xs font-semibold text-white/45">Lowercase letters, numbers, and hyphens only.</span>
              ) : null}
            </label>
          ))}
          <label className="grid gap-2 text-sm font-bold text-white/80">
            Event tag
            <select name="eventTag" className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-orange)]">
              {eventTagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
          <ImageUploadField name="flyerImageUrl" label="Flyer image" accent="var(--ec-orange)" uploadType="adminEventFlyer" />
          <label className="grid gap-2 text-sm font-bold text-white/80">
            Description
            <textarea
              name="description"
              required
              className="min-h-32 rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-orange)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-white/80">
            Status
            <select name="status" className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-orange)]">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-white/75">
              <input name="isOfficial" type="checkbox" /> Official
            </label>
            <label className="flex items-center gap-2 text-sm text-white/75">
              <input name="isFeatured" type="checkbox" /> Featured
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-white/75">
              <input name="announceToDiscord" type="checkbox" /> Announce to Discord
            </label>
          </div>
          <button className="ec-button-primary px-4 py-3" type="submit">
            Save event
          </button>
        </form>

        <div className="grid gap-4">
          {events.length ? events.map((event) => (
            <ActionCard key={event.id} title={event.title}>
              <div className="space-y-4">
                <p>
                  {event.status} - {event.isOfficial ? "Official" : event.eventTag} - {event.eventDate.toLocaleString()} - {event.location}
                </p>
                <div className="flex flex-wrap gap-2">
                  {["DRAFT", "PUBLISHED", "ARCHIVED"].map((status) => (
                    <form key={status} action={updateOfficialEventStatus}>
                      <input name="id" type="hidden" value={event.id} />
                      <input name="status" type="hidden" value={status} />
                      <button className={eventStatusButtonClass(event.status, status)} type="submit">
                        {status}
                      </button>
                    </form>
                  ))}
                  <form action={toggleOfficialEventFeatured}>
                    <input name="id" type="hidden" value={event.id} />
                    <input name="isFeatured" type="hidden" value={String(event.isFeatured)} />
                    <button className={event.isFeatured ? activeFeaturedButtonClass : inactiveStatusButtonClass} type="submit">
                      {event.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                  </form>
                  <form action={deleteOfficialEvent}>
                    <input name="id" type="hidden" value={event.id} />
                    <button className="rounded-md border border-[color:rgba(255,75,75,0.45)] px-3 py-2 text-xs font-black text-[color:var(--ec-red)] hover:bg-[color:rgba(255,75,75,0.10)]" type="submit">
                      Delete
                    </button>
                  </form>
                </div>
                <details className="rounded-lg border border-white/10 bg-black/35 p-4">
                  <summary className="cursor-pointer font-black text-white">Edit event details</summary>
                  <form action={updateOfficialEvent} className="mt-4 grid gap-3">
                    <input name="id" type="hidden" value={event.id} />
                    <input name="title" defaultValue={event.title} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
                    <input name="slug" defaultValue={event.slug} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
                    <input name="eventDate" type="datetime-local" defaultValue={event.eventDate.toISOString().slice(0, 16)} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
                    <select name="eventTag" defaultValue={event.eventTag} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white">
                      {eventTagOptions.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                    <input name="host" defaultValue={event.host} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
                    <input name="location" defaultValue={event.location} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
                    <ImageUploadField name="flyerImageUrl" label="Flyer image" defaultValue={event.flyerImageUrl} accent="var(--ec-orange)" uploadType="adminEventFlyer" />
                    <input name="flyerAlt" defaultValue={event.flyerAlt || ""} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
                    <input name="discordUrl" type="url" defaultValue={event.discordUrl || ""} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
                    <input name="rsvpUrl" type="url" defaultValue={event.rsvpUrl || ""} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
                    <textarea name="description" defaultValue={event.description} className="min-h-28 rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
                    <select name="status" defaultValue={event.status} className="rounded-md border border-white/10 bg-black px-3 py-2 text-white">
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-white/75">
                      <input name="isOfficial" type="checkbox" defaultChecked={event.isOfficial} /> Official
                    </label>
                    <label className="flex items-center gap-2 text-sm text-white/75">
                      <input name="isFeatured" type="checkbox" defaultChecked={event.isFeatured} /> Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm text-white/75">
                      <input name="announceToDiscord" type="checkbox" /> Announce to Discord
                    </label>
                    <button className="ec-button-primary px-3 py-2 text-sm" type="submit">Save changes</button>
                  </form>
                </details>
              </div>
            </ActionCard>
          )) : (
            <div className="ec-panel rounded-lg p-5 text-[color:var(--ec-muted)]">
              No events created yet.
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
