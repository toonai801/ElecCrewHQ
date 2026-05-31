import type { ReactNode } from "react";

export function ActionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="ec-panel rounded-lg p-5">
      <h3 className="text-lg font-black text-white">{title}</h3>
      <div className="ec-text-muted mt-4 text-sm leading-6">{children}</div>
    </div>
  );
}
