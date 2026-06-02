import { EventCard } from "@/components/event-card";
import { Section } from "@/components/section";
import { auth } from "@/lib/auth";
import { getPublishedEvents } from "@/lib/content";

export default async function EventsPage() {
  const session = await auth();
  const events = await getPublishedEvents(session?.user.id);
  const canRsvp = Boolean(session?.user.isActive && !session.user.isBanned && session.user.isApproved && session.user.onboardingComplete);

  return (
    <Section title="Upcoming events">
      {events.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} canRsvp={canRsvp} />
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
