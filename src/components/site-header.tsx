import Link from "next/link";
import { Zap } from "lucide-react";
import { auth } from "@/lib/auth";
import { canModeratePosts } from "@/lib/permissions";
import { navItems } from "@/lib/sample-data";

export async function SiteHeader() {
  const session = await auth();
  const role = session?.user.role;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="grid size-11 place-items-center rounded-lg border border-[color:rgba(245,197,66,0.40)] bg-[color:rgba(245,197,66,0.10)] text-[color:var(--ec-gold)] shadow-[0_0_24px_rgba(245,197,66,0.28)]">
            <Zap className="size-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-black uppercase tracking-[0.24em] text-[color:var(--ec-gold)]">
              Electric Crew
            </span>
            <span className="ec-text-soft text-sm">VR community hub</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white/75">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 hover:bg-white/10 hover:text-white">
              {item.label}
            </Link>
          ))}
          <Link href={session ? "/account" : "/login"} className="rounded-md px-3 py-2 hover:bg-white/10 hover:text-white">
            {session ? "Profile" : "Login"}
          </Link>
          {canModeratePosts(role) ? (
            <Link href="/admin" className="rounded-md border border-[color:rgba(245,197,66,0.30)] px-3 py-2 text-[color:var(--ec-gold)] hover:bg-[color:rgba(245,197,66,0.10)]">
              Admin
            </Link>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
