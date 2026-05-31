import Link from "next/link";
import { discordInviteUrl } from "@/lib/sample-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-10 text-sm text-white/60 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>Electric Crew VR. Official events, community stories, and moderated creative energy.</p>
        <div className="flex flex-wrap gap-4">
          <Link className="hover:text-yellow-200" href="/contact">
            Contact
          </Link>
          <a className="hover:text-yellow-200" href={discordInviteUrl} target="_blank" rel="noreferrer">
            Join Discord
          </a>
        </div>
      </div>
    </footer>
  );
}
