import Image from "next/image";
import { getSiteSettings } from "@/lib/content";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const announcement =
    typeof settings.homepageAnnouncement === "string" && settings.homepageAnnouncement
      ? settings.homepageAnnouncement
      : null;

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="ec-stage ec-spectrum-border rounded-lg border border-white/10 bg-black/45">
          <div className="relative z-10 grid min-h-[680px] gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
            <div className="flex flex-col justify-between gap-10">
              <div>
                <div className="mb-7 flex flex-wrap items-center gap-3">
                  <span className="ec-hud border border-[color:rgba(245,197,66,0.55)] bg-[color:rgba(245,197,66,0.12)] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[color:var(--ec-gold)]">
                    Official Electric Crew VR
                  </span>
                  <span className="ec-hud border border-[color:rgba(57,255,136,0.42)] bg-[color:rgba(57,255,136,0.09)] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--ec-green)]">
                    Admin beta online
                  </span>
                </div>

                <h1 className="max-w-5xl text-5xl font-black leading-[0.92] text-white sm:text-7xl lg:text-8xl">
                  Electric Crew <span className="ec-spectrum-text">VR</span>
                </h1>
                <div className="mt-6 max-w-3xl space-y-4 text-xl leading-9 text-white/78">
                  <p>A colorful VR community powered by friendship, chaos, music, gaming, and unapologetic self-expression.</p>
                  <p>Electric Crew VR is an LGBTQ+ forward community built for people who want more than just another VR group. We create spaces where everyone can vibe, laugh, dance, game, socialize, and feel welcome exactly as they are.</p>
                  <p>From late-night hangouts and movie nights to live DJs, community events, dance floors, and unforgettable VR adventures, Electric Crew is all about good energy and genuine connection.</p>
                  <p>Whether you&apos;re here to meet people, express yourself, party with the crew, or just escape reality for a while,
                    you belong here.</p>
                </div>

              </div>

              {announcement ? (
                <div className="ec-hud border border-[color:rgba(57,255,136,0.35)] bg-[color:rgba(57,255,136,0.08)] p-4 text-sm font-bold leading-6 text-white/80">
                  {announcement}
                </div>
              ) : null}

            </div>

            <div>
              <div className="ec-hud relative min-h-[490px] overflow-hidden border border-white/10 bg-black">
                <Image
                  src="/electric-crew-bolt-logo.png"
                  alt="Electric Crew lightning bolt logo"
                  fill
                  priority
                  className="object-contain p-8 sm:p-10"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/80 to-transparent" />
                <div className="absolute bottom-7 left-5 right-5">
                  <div className="mb-4 grid grid-cols-7 gap-1">
                    {[
                      "bg-[color:var(--ec-red)]",
                      "bg-[color:var(--ec-orange)]",
                      "bg-[color:var(--ec-yellow)]",
                      "bg-[color:var(--ec-green)]",
                      "bg-[color:var(--ec-cyan)]",
                      "bg-[color:var(--ec-blue)]",
                      "bg-[color:var(--ec-magenta)]",
                    ].map((color) => (
                      <span key={color} className={`h-1.5 rounded-full ${color}`} />
                    ))}
                  </div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-white/60">
                    Live crew signal
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    Music. Worlds. Photos. Chosen family.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
