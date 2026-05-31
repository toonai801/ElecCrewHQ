import { notFound } from "next/navigation";
import { EventCard } from "@/components/event-card";
import { Section } from "@/components/section";
import { getEventBySlug } from "@/lib/content";
import { discordInviteUrl } from "@/lib/sample-data";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <Section eyebrow="Event details" title={event.title}>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <EventCard event={event} />
        <div className="space-y-5 text-white/72">
          <p className="text-lg leading-8">{event.description}</p>
          <a className="ec-button-primary inline-flex px-5 py-3" href={event.rsvpUrl || event.discordUrl || discordInviteUrl} target="_blank" rel="noreferrer">
            RSVP or get Discord details
          </a>
        </div>
      </div>
    </Section>
  );
}
