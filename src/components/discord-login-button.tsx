"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { authOrigin } from "@/lib/auth-origin";

export function DiscordLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="mt-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        if (window.location.origin !== authOrigin) {
          window.location.href = `${authOrigin}/login`;
          return;
        }

        const result = await signIn("discord", {
          callbackUrl: "/account",
          redirect: false,
        });

        if (result?.url) {
          window.location.href = result.url;
          return;
        }

        setIsLoading(false);
        setError("Discord login did not start. Refresh and try again.");
      }}
    >
      <button className="ec-button-cyan px-5 py-3 font-black" disabled={isLoading} type="submit">
        {isLoading ? "Opening Discord..." : "Continue with Discord"}
      </button>
      {error ? <p className="mt-3 text-sm font-bold text-[color:var(--ec-red)]">{error}</p> : null}
    </form>
  );
}
