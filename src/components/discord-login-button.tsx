"use client";

import { signIn } from "next-auth/react";

export function DiscordLoginButton() {
  return (
    <button
      className="ec-button-cyan mt-6 px-5 py-3 font-black"
      type="button"
      onClick={() => signIn("discord", { callbackUrl: "/account" })}
    >
      Continue with Discord
    </button>
  );
}
