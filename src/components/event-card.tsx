import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Mic2 } from "lucide-react";

type EventCardProps = {
  event: {
    title: string;
    slug: string;
    description: string;
    eventDate: Date;
    location: string;
    host: string;
    flyerImageUrl: string;
    flyerAlt?: string | null;
    isFeatured?: boolean;
  };
};

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="ec-panel ec-accent-events ec-card-hover ec-hud overflow-hidden rounded-lg shadow-[0_0_30px_rgba(255,138,31,0.18)]">
      <div className="relative aspect-[16/10]">
        <Image src={event.flyerImageUrl} alt={event.flyerAlt || event.title} fill className="object-cover saturate-150" sizes="(min-width: 1024px) 33vw, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {event.isFeatured ? (
          <span className="absolute left-4 top-4 rounded-md bg-[color:var(--ec-gold)] px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
            Featured
          </span>
        ) : null}
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
        <Link href={`/events/${event.slug}`} className="ec-button-primary inline-flex px-4 py-2 text-sm">
          Event details
        </Link>
      </div>
    </article>
  );
}
