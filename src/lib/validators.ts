import { z } from "zod";
import { getUploadLimitBytes, supportedImageTypes } from "@/lib/upload-limits";

const imageUrl = z
  .string()
  .url()
  .optional()
  .or(z.literal(""));

export const communityTagOptions = [
  "announcement",
  "event",
  "flyer",
  "music",
  "neon-surge",
  "photos",
  "safety",
  "vrchat",
  "worlds",
] as const;

export const officialEventSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(20).max(2000),
  eventDate: z.coerce.date(),
  location: z.string().min(2).max(160),
  host: z.string().min(2).max(120),
  flyerImageUrl: imageUrl,
  flyerAlt: z.string().max(180).optional(),
  discordUrl: imageUrl,
  rsvpUrl: imageUrl,
  isFeatured: z.coerce.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const communityPostSchema = z.object({
  title: z.string().min(3).max(120),
  body: z.string().min(1).max(4000),
  postType: z.enum(["EVENT", "FLYER", "PHOTO", "TEXT", "LINK"]),
  imageUrl,
  imageAlt: z.string().max(180).optional(),
  externalUrl: imageUrl,
  tags: z
    .string()
    .max(240)
    .transform((value) =>
      value
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    )
    .refine((tags) => tags.every((tag) => communityTagOptions.includes(tag as (typeof communityTagOptions)[number])), {
      message: "Unsupported community tag",
    }),
  visibility: z.enum(["PUBLIC", "MEMBERS_ONLY"]),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(80),
  avatarUrl: imageUrl,
  bio: z.string().max(600).optional(),
});

export const maxImageUploadBytes = getUploadLimitBytes("community");
export { supportedImageTypes };
