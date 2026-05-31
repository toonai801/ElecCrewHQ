import { EventCard } from "@/components/event-card";
import { Section } from "@/components/section";
import { sampleEvents } from "@/lib/sample-data";

export default function EventsPage() {
  return (
    <Section eyebrow="Official events" title="Published Electric Crew events">
      <div className="mb-8 rounded-lg border border-yellow-300/20 bg-yellow-300/10 p-5 text-sm leading-6 text-yellow-50">
        Event creation, editing, draft/published status, featured toggles, and Discord announcements are reserved for TOON/admin users.
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {sampleEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </Section>
  );
}
