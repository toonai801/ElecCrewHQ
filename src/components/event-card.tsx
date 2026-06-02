import Link from "next/link";
import { CalendarDays, MapPin, Mic2 } from "lucide-react";
import { setEventRsvp } from "@/app/events/actions";

type EventCardProps = {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string;
    eventDate: Date;
    location: string;
    host: string;
    flyerImageUrl: string;
    flyerAlt?: string | null;
    eventTag?: string | null;
    isOfficial?: boolean;
    isFeatured?: boolean;
    rsvpCounts?: Record<string, number>;
    viewerRsvp?: string | null;
  };
  canRsvp?: boolean;
};

const rsvpLabels = [
  ["GOING", "Going"],
  ["MAYBE", "Maybe"],
  ["SADLY_NO", "Sadly no"],
];

export function EventCard({ event, canRsvp = false }: EventCardProps) {
  return (
    <article className="ec-panel ec-accent-events ec-card-hover ec-hud overflow-hidden rounded-lg shadow-[0_0_30px_rgba(255,138,31,0.18)]">
      <div className="flex flex-wrap gap-2 border-b border-white/10 bg-black/45 p-3">
        <span className="rounded-md bg-black/80 px-3 py-1 text-xs font-black uppercase tracking-widest text-white ring-1 ring-white/15">
          {event.isOfficial ? "Official" : event.eventTag || "Community Event"}
        </span>
        {event.isFeatured ? (
          <span className="rounded-md bg-[color:var(--ec-gold)] px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
            Featured
          </span>
        ) : null}
      </div>
      <div className="bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.flyerImageUrl}
          alt={event.flyerAlt || event.title}
          className="h-auto max-h-[920px] w-full object-contain saturate-150"
          loading="lazy"
        />
      </div>
      <div className="space-y-4 p-5">
        <h3 className="text-xl font-black text-white">{event.title}</h3>
        <p className="ec-text-muted text-sm leading-6">{event.description}</p>
        <dl className="ec-text-muted grid gap-2 text-sm">
          <div className="flex gap-2">
            <CalendarDays className="mt-0.5 size-4 text-[color:var(--ec-orange)]" />
            <dd>{event.eventDate.toLocaleString()}</dd>
          </div>
          <div className="flex gap-2">
            <MapPin className="mt-0.5 size-4 text-[color:var(--ec-yellow)]" />
            <dd>{event.location}</dd>
          </div>
          <div className="flex gap-2">
            <Mic2 className="mt-0.5 size-4 text-[color:var(--ec-gold)]" />
            <dd>{event.host}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2">
          {rsvpLabels.map(([status, label]) => {
            const active = event.viewerRsvp === status;
            const count = event.rsvpCounts?.[status] || 0;

            return canRsvp ? (
              <form key={status} action={setEventRsvp}>
                <input name="eventId" type="hidden" value={event.id} />
                <input name="slug" type="hidden" value={event.slug} />
                <input name="status" type="hidden" value={status} />
                <button
                  className={active ? "rounded-md border border-[color:rgba(57,255,136,0.75)] bg-[color:rgba(57,255,136,0.16)] px-3 py-2 text-xs font-black text-[color:var(--ec-green)]" : "ec-button-ghost px-3 py-2 text-xs font-black"}
                  type="submit"
                >
                  {label} {count}
                </button>
              </form>
            ) : (
              <span key={status} className="rounded-md border border-white/10 px-3 py-2 text-xs font-black text-white/60">
                {label} {count}
              </span>
            );
          })}
        </div>
        <Link href={`/events/${event.slug}`} className="ec-button-primary inline-flex px-4 py-2 text-sm">
          Event details
        </Link>
      </div>
    </article>
  );
}
