import { Section } from "@/components/section";
import { values } from "@/lib/sample-data";

export default function MissionPage() {
  return (
    <Section eyebrow="Mission" title="A safe, creative VR gathering space">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <p className="text-xl leading-9 text-white/76">
          Electric Crew VR exists to create an energetic, inclusive home for music lovers, creators, and friends who want connection inside and outside the headset.
        </p>
        <div className="grid gap-4">
          {values.map((value) => (
            <div key={value} className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-white/72">
              {value}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
