import { EventCard } from "@/components/event-card";
import { Section } from "@/components/section";
import { getPublishedEvents } from "@/lib/content";

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <Section title="Upcoming events">
      <div className="grid gap-5 lg:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </Section>
  );
}
