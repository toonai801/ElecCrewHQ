"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function BetaLoginForm() {
  const [error, setError] = useState("");

  return (
    <form
      className="mt-6 grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");

        const form = new FormData(event.currentTarget);
        const result = await signIn("credentials", {
          email: String(form.get("email") || ""),
          password: String(form.get("password") || ""),
          redirect: false,
          callbackUrl: "/admin",
        });

        if (result?.ok) {
          window.location.href = result.url || "/admin";
          return;
        }

        setError("Login failed. Check the beta admin email and password.");
      }}
    >
      <label className="grid gap-2 text-sm font-bold text-white/80">
        Email
        <input name="email" type="email" className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-cyan)]" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-white/80">
        Password
        <input name="password" type="password" className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[color:var(--ec-cyan)]" />
      </label>
      {error ? <p className="text-sm font-bold text-[color:var(--ec-red)]">{error}</p> : null}
      <button className="ec-button-cyan px-5 py-3 font-black" type="submit">
        Enter Beta Admin
      </button>
    </form>
  );
}
