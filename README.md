# Electric Crew VR Community Hub

Official Next.js foundation for Electric Crew VR at `www.electriccrewvr.com`.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Prisma with PostgreSQL
- NextAuth with Discord OAuth foundation
- Role-based access control for TOON, ADMIN, MODERATOR, TRUSTED_CREW, and MEMBER
- Discord invite, optional widget, and private webhook utility

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in the real values.

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Apply the database schema:

```bash
npm run prisma:migrate
```

5. Seed starter data:

```bash
npm run seed
```

6. Start the dev server:

```bash
npm run dev
```

## Beta Lock

Set `BETA_LOCK_ENABLED=true` during beta. Only users whose email is in `BETA_ALLOWED_EMAILS`, whose Discord ID is in `BETA_ALLOWED_DISCORD_IDS`, or whose database user has `isBetaAllowed=true` can access account/admin areas.

## Roles

- `TOON`: super owner, full control, cannot be demoted or deleted from UI.
- `ADMIN`: manages events, posts, users, trusted crew, and settings except TOON-only controls.
- `MODERATOR`: approves/rejects community posts and recommends trusted crew.
- `TRUSTED_CREW`: can auto-approve posts after beta unlock.
- `MEMBER`: can manage profile and submit posts after beta unlock.
- Guests can view public pages, published events, approved posts, gallery, Discord, and contact.

## Discord

- `NEXT_PUBLIC_DISCORD_INVITE_URL` powers public join buttons.
- `NEXT_PUBLIC_DISCORD_WIDGET_ID` optionally renders the server widget.
- `DISCORD_WEBHOOK_URL` is server-only and used by `src/lib/discord.ts` for official event announcements.

Never commit real secrets, webhook URLs, OAuth secrets, database URLs, or admin credentials.
