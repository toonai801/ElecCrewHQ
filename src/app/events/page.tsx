import { EventCard } from "@/components/event-card";
import { Section } from "@/components/section";
import { getPublishedEvents } from "@/lib/content";

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <Section title="Upcoming events">
      {events.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="ec-panel ec-accent-events rounded-lg p-5 text-[color:var(--ec-muted)]">
          No upcoming events yet.
        </div>
      )}
    </Section>
  );
}
