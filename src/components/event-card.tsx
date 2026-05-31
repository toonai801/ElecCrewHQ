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
    <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-[0_0_30px_rgba(14,165,233,0.12)]">
      <div className="relative aspect-[16/10]">
        <Image src={event.flyerImageUrl} alt={event.flyerAlt || event.title} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
        {event.isFeatured ? (
          <span className="absolute left-4 top-4 rounded-md bg-yellow-300 px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
            Featured
          </span>
        ) : null}
      </div>
      <div className="space-y-4 p-5">
        <h3 className="text-xl font-black text-white">{event.title}</h3>
        <p className="text-sm leading-6 text-white/70">{event.description}</p>
        <dl className="grid gap-2 text-sm text-white/70">
          <div className="flex gap-2">
            <CalendarDays className="mt-0.5 size-4 text-cyan-200" />
            <dd>{event.eventDate.toLocaleString()}</dd>
          </div>
          <div className="flex gap-2">
            <MapPin className="mt-0.5 size-4 text-fuchsia-200" />
            <dd>{event.location}</dd>
          </div>
          <div className="flex gap-2">
            <Mic2 className="mt-0.5 size-4 text-yellow-200" />
            <dd>{event.host}</dd>
          </div>
        </dl>
        <Link href={`/events/${event.slug}`} className="inline-flex rounded-md bg-white px-4 py-2 text-sm font-bold text-black hover:bg-yellow-200">
          Event details
        </Link>
      </div>
    </article>
  );
}
