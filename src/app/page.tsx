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
          <div className="relative z-10 p-5 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-3xl">
              <div>
                <div className="ec-hud overflow-hidden border border-white/10 bg-black shadow-[0_0_50px_rgba(245,197,66,0.10)]">
                  <div className="relative mx-auto aspect-square max-w-md">
                    <Image
                      src="/electric-crew-bolt-logo.png"
                      alt="Electric Crew lightning bolt logo"
                      fill
                      priority
                      className="object-contain p-6 sm:p-8"
                      sizes="(min-width: 768px) 448px, 90vw"
                    />
                  </div>
                  <div className="border-t border-white/10 bg-black/70 p-5 sm:p-6">
                    <div className="mb-4 grid grid-cols-7 gap-1.5">
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
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-white/55 sm:text-sm">
                      Live crew signal
                    </p>
                    <p className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">
                      Music. Worlds. Photos. Chosen family.
                    </p>
                  </div>
                </div>

                <div className="mt-7 max-w-2xl space-y-5 text-lg leading-8 text-white/76 sm:text-xl sm:leading-9">
                  <p>
                    A colorful VR community powered by friendship, chaos, music,
                    gaming, and unapologetic self-expression.
                  </p>
                  <p>
                    Electric Crew VR is an LGBTQ+ forward community built for
                    people who want more than just another VR group. We create
                    spaces where everyone can vibe, laugh, dance, game,
                    socialize, and feel welcome exactly as they are.
                  </p>
                  <p>
                    From late-night hangouts and movie nights to live DJs,
                    community events, dance floors, and unforgettable VR
                    adventures, Electric Crew is all about good energy and
                    genuine connection.
                  </p>
                  <p>
                    Whether you&apos;re here to meet people, express yourself,
                    party with the crew, or just escape reality for a while, you
                    belong here.
                  </p>
                </div>
              </div>

              {announcement ? (
                <div className="ec-hud mt-8 border border-[color:rgba(57,255,136,0.35)] bg-[color:rgba(57,255,136,0.08)] p-4 text-sm font-bold leading-6 text-white/80">
                  {announcement}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
