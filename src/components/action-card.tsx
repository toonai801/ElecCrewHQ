import type { ReactNode } from "react";

export function ActionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <h3 className="text-lg font-black text-white">{title}</h3>
      <div className="mt-4 text-sm leading-6 text-white/70">{children}</div>
    </div>
  );
}
