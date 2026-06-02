import { notFound } from "next/navigation";
import { EventCard } from "@/components/event-card";
import { Section } from "@/components/section";
import { auth } from "@/lib/auth";
import { getEventBySlug } from "@/lib/content";
import { discordInviteUrl } from "@/lib/sample-data";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const event = await getEventBySlug(slug, session?.user.id);
  const canRsvp = Boolean(session?.user.isActive && !session.user.isBanned && session.user.isApproved && session.user.onboardingComplete);

  if (!event) {
    notFound();
  }

  return (
    <Section eyebrow="Event details" title={event.title}>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <EventCard event={event} canRsvp={canRsvp} />
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
