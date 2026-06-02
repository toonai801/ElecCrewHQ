import { Section } from "@/components/section";
import { discordInviteUrl } from "@/lib/sample-data";

export default function ContactPage() {
  return (
    <Section eyebrow="Contact" title="Reach Electric Crew VR">
      <div className="max-w-3xl rounded-lg border border-white/10 bg-white/[0.04] p-6 text-lg leading-8 text-white/72">
        <p>
          For booking, moderation questions, flyer submissions, or partnership ideas, DM TOON on Discord.
        </p>
        <a href={discordInviteUrl} target="_blank" rel="noreferrer" className="ec-button-cyan mt-6 inline-flex px-5 py-3 font-black">
          Contact through Discord
        </a>
      </div>
    </Section>
  );
}
