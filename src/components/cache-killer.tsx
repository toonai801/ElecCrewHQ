"use client";

import { useEffect } from "react";

export function CacheKiller() {
  useEffect(() => {
    async function clearOldClientState() {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }
    }

    clearOldClientState().catch(() => {
      // Cache cleanup is best-effort and should never block the app.
    });
  }, []);

  return null;
}
