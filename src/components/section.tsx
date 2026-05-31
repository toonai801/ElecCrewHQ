import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        {eyebrow ? <p className="ec-eyebrow">{eyebrow}</p> : null}
        <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">{title}</h2>
        <div className="ec-rainbow-line mt-5 w-28 rounded-full" />
      </div>
      {children}
    </section>
  );
}
