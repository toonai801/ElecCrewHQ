import { Client } from "pg";
import { NextResponse, type NextRequest } from "next/server";

const statements = [
  `CREATE SCHEMA IF NOT EXISTS "public"`,
  `DO $$ BEGIN CREATE TYPE "Role" AS ENUM ('TOON', 'ADMIN', 'MODERATOR', 'TRUSTED_CREW', 'MEMBER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "PostType" AS ENUM ('EVENT', 'FLYER', 'PHOTO', 'TEXT', 'LINK'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "PostStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "PostVisibility" AS ENUM ('PUBLIC', 'MEMBERS_ONLY'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "RecommendationType" AS ENUM ('TRUSTED_CREW'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "RecommendationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "avatarUrl" TEXT,
    "discordId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "bio" TEXT,
    "profileSlug" TEXT,
    "isBetaAllowed" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "OfficialEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "flyerImageUrl" TEXT NOT NULL,
    "flyerAlt" TEXT,
    "discordUrl" TEXT,
    "rsvpUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OfficialEvent_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "CommunityPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "postType" "PostType" NOT NULL,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "externalUrl" TEXT,
    "tags" TEXT[],
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING',
    "visibility" "PostVisibility" NOT NULL DEFAULT 'PUBLIC',
    "authorId" TEXT NOT NULL,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "ModeratorRecommendation" (
    "id" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recommendationType" "RecommendationType" NOT NULL DEFAULT 'TRUSTED_CREW',
    "reason" TEXT NOT NULL,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ModeratorRecommendation_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_discordId_key" ON "User"("discordId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_profileSlug_key" ON "User"("profileSlug")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "OfficialEvent_slug_key" ON "OfficialEvent"("slug")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "SiteSetting_key_key" ON "SiteSetting"("key")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token")`,
];

const constraints = [
  [`OfficialEvent_createdById_fkey`, `ALTER TABLE "OfficialEvent" ADD CONSTRAINT "OfficialEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`],
  [`CommunityPost_authorId_fkey`, `ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`],
  [`CommunityPost_approvedById_fkey`, `ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`],
  [`ModeratorRecommendation_moderatorId_fkey`, `ALTER TABLE "ModeratorRecommendation" ADD CONSTRAINT "ModeratorRecommendation_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`],
  [`ModeratorRecommendation_userId_fkey`, `ALTER TABLE "ModeratorRecommendation" ADD CONSTRAINT "ModeratorRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`],
  [`ModeratorRecommendation_reviewedById_fkey`, `ALTER TABLE "ModeratorRecommendation" ADD CONSTRAINT "ModeratorRecommendation_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`],
  [`Account_userId_fkey`, `ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`],
  [`Session_userId_fkey`, `ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`],
] as const;

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-migration-secret");

  if (!process.env.MIGRATION_SECRET || secret !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 500 });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  try {
    await client.query("BEGIN");

    for (const statement of statements) {
      await client.query(statement);
    }

    for (const [name, statement] of constraints) {
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = '${name}'
          ) THEN
            ${statement};
          END IF;
        END $$;
      `);
    }

    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Migration failed" },
      { status: 500 },
    );
  } finally {
    await client.end();
  }
}
