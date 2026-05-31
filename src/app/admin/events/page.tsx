import { ActionCard } from "@/components/action-card";
import { Section } from "@/components/section";
import { requireRole } from "@/lib/permissions";
import { sampleEvents } from "@/lib/sample-data";

export default async function AdminEventsPage() {
  await requireRole(["TOON", "ADMIN"]);

  return (
    <Section eyebrow="Admin events" title="Official event management">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
          {["Title", "Slug", "Date and time", "Host/DJ/Performer", "VR world/location", "Flyer image URL", "Discord link", "RSVP link"].map((label) => (
            <label key={label} className="grid gap-2 text-sm font-bold text-white/80">
              {label}
              <input className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-yellow-300" />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-bold text-white/80">
            Description
            <textarea className="min-h-32 rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-yellow-300" />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-2 text-sm text-white/75">
              <input type="checkbox" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-white/75">
              <input type="checkbox" /> Published
            </label>
            <label className="flex items-center gap-2 text-sm text-white/75">
              <input type="checkbox" /> Announce to Discord
            </label>
          </div>
          <button className="rounded-md bg-yellow-300 px-4 py-3 font-black text-black" type="button">
            Save event
          </button>
        </form>
        <div className="grid gap-4">
          {sampleEvents.map((event) => (
            <ActionCard key={event.id} title={event.title}>
              {event.status} · {event.eventDate.toLocaleString()} · {event.location}
            </ActionCard>
          ))}
        </div>
      </div>
    </Section>
  );
}
