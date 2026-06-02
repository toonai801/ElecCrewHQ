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
                  <div className="border-t border-white/10 bg-black/70 p-5 text-center sm:p-6">
                    <div className="mx-auto mb-4 grid max-w-xl grid-cols-7 gap-1.5">
                      {[
                        "bg-[color:var(--ec-red)]",
                        "bg-[color:var(--ec-orange)]",
                        "bg-[color:var(--ec-yellow)]",
                        "bg-[color:var(--ec-green)]",
                        "bg-[color:var(--ec-cyan)]",
                        "bg-[color:var(--ec-blue)]",
                        "bg-[color:var(--ec-magenta)]",
                      ].map((color) => (
                        <span key={color} className={`ec-spectrum-bar h-1.5 rounded-full ${color}`} />
                      ))}
                    </div>
                    <p className="ec-welcome-text mt-3 text-center text-6xl font-black leading-none sm:text-7xl lg:text-8xl">
                      Welcome
                    </p>
                  </div>
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
