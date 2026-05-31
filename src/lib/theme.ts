export const electricCrewTheme = {
  colorMap: {
    base: "#030306",
    surface: "#09090f",
    panel: "rgba(255, 255, 255, 0.04)",
    border: "rgba(255, 255, 255, 0.10)",
    text: "#ffffff",
    muted: "rgba(255, 255, 255, 0.68)",
    gold: "#f5c542",
    red: "#ff4b4b",
    orange: "#ff8a1f",
    yellow: "#ffe156",
    green: "#39ff88",
    cyan: "#22d3ee",
    blue: "#4f8cff",
    violet: "#a855f7",
    magenta: "#ec4899",
  },
  usage: {
    base: "Page background, nav, dashboards, and content areas.",
    gold: "Primary Electric Crew brand accent, active states, and main CTAs.",
    rainbow: "Small badges, status details, and metadata only.",
    cyanMagentaViolet: "Secondary neon accents for tags, gallery, Discord, and moderation states.",
  },
} as const;

export const postTypeTone: Record<string, string> = {
  EVENT: "ec-badge-red",
  FLYER: "ec-badge-orange",
  PHOTO: "ec-badge-cyan",
  TEXT: "ec-badge-violet",
  LINK: "ec-badge-green",
};
