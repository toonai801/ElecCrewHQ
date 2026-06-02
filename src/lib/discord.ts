import type { OfficialEvent } from "@/generated/prisma/client";
import { formatEventDateRange } from "@/lib/event-dates";

export async function announceOfficialEvent(event: Pick<OfficialEvent, "title" | "description" | "eventDate" | "eventEndDate" | "location" | "host" | "discordUrl" | "rsvpUrl">) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return { ok: false, reason: "Discord webhook is not configured." };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      username: "Electric Crew VR",
      content: `Official Electric Crew event published: **${event.title}**`,
      embeds: [
        {
          title: event.title,
          description: event.description,
          color: 0xf5c542,
          fields: [
            { name: "When", value: formatEventDateRange(event), inline: true },
            { name: "Where", value: event.location, inline: true },
            { name: "Host", value: event.host, inline: true },
            { name: "RSVP", value: event.rsvpUrl || event.discordUrl || "Join Discord for details" },
          ],
        },
      ],
    }),
  });

  return { ok: response.ok, reason: response.ok ? null : await response.text() };
}
