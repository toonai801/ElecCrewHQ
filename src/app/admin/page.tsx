import Link from "next/link";
import { Section } from "@/components/section";
import { requireRole } from "@/lib/permissions";

export default async function AdminPage() {
  const { role } = await requireRole(["TOON", "ADMIN", "MODERATOR"]);
  const links = [
    { href: "/admin/events", label: "Events" },
    { href: "/admin/community", label: "Posts" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/recommendations", label: "Recommendations" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <Section eyebrow="Admin" title="Electric Crew control room">
      <div className="ec-panel ec-accent-warning mb-8 rounded-lg p-5 font-black text-white">
        Current role: {role}
      </div>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="ec-button-primary px-5 py-3">
            {link.label}
          </Link>
        ))}
      </div>
    </Section>
  );
}
