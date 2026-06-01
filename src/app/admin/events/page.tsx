import { ActionCard } from "@/components/action-card";
import { ImageUploadField } from "@/components/image-upload-field";
import { Section } from "@/components/section";
import { getAllOfficialEventsForAdmin } from "@/lib/content";
import { requireRole } from "@/lib/permissions";
import {
  createOfficialEvent,
  deleteOfficialEvent,
  toggleOfficialEventFeatured,
  updateOfficialEvent,
  updateOfficialEventStatus,
} from "@/app/admin/events/actions";

export default async function AdminEventsPage() {
  await requireRole(["TOON", "ADMIN"]);
  const events = await getAllOfficialEventsForAdmin();

  return (
    <Section eyebrow="Admin events" title="Official event management">
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
                required={["title", "slug", "eventDate", "host", "location"].includes(name)}
                className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-orange)]"
              />
            </label>
          ))}
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
              <input name="isFeatured" type="checkbox" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-white/75">
              <input name="announceToDiscord" type="checkbox" /> Announce to Discord
            </label>
          </div>
          <button className="ec-button-primary px-4 py-3" type="submit">
            Save event
          </button>
        </form>

        <div className="grid gap-4">
          {events.map((event) => (
            <ActionCard key={event.id} title={event.title}>
              <div className="space-y-4">
                <p>
                  {event.status} - {event.eventDate.toLocaleString()} - {event.location}
                </p>
                <div className="flex flex-wrap gap-2">
                  {["DRAFT", "PUBLISHED", "ARCHIVED"].map((status) => (
                    <form key={status} action={updateOfficialEventStatus}>
                      <input name="id" type="hidden" value={event.id} />
                      <input name="status" type="hidden" value={status} />
                      <button className="ec-button-ghost px-3 py-2 text-xs font-black" type="submit">
                        {status}
                      </button>
                    </form>
                  ))}
                  <form action={toggleOfficialEventFeatured}>
                    <input name="id" type="hidden" value={event.id} />
                    <input name="isFeatured" type="hidden" value={String(event.isFeatured)} />
                    <button className="ec-button-ghost px-3 py-2 text-xs font-black" type="submit">
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
          ))}
        </div>
      </div>
    </Section>
  );
}
