import { notFound } from "next/navigation";
import { EventCard } from "@/components/event-card";
import { Section } from "@/components/section";
import { sampleEvents } from "@/lib/sample-data";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = sampleEvents.find((item) => item.slug === slug);

  if (!event) {
    notFound();
  }

  return (
    <Section eyebrow="Event details" title={event.title}>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <EventCard event={event} />
        <div className="space-y-5 text-white/72">
          <p className="text-lg leading-8">{event.description}</p>
          <a className="inline-flex rounded-md bg-yellow-300 px-5 py-3 font-black text-black hover:bg-white" href={event.rsvpUrl || event.discordUrl} target="_blank" rel="noreferrer">
            RSVP or get Discord details
          </a>
        </div>
      </div>
    </Section>
  );
}
