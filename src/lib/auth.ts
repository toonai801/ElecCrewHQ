import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const providers = [
  ...(process.env.BETA_ADMIN_EMAIL && process.env.BETA_ADMIN_PASSWORD
    ? [
        CredentialsProvider({
          name: "Beta admin",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            const email = credentials?.email?.toLowerCase().trim();
            const password = credentials?.password || "";

            if (
              !email ||
              email !== process.env.BETA_ADMIN_EMAIL?.toLowerCase().trim() ||
              password !== process.env.BETA_ADMIN_PASSWORD
            ) {
              return null;
            }

            const user = await prisma.user.upsert({
              where: { email },
              update: {
                role: "TOON",
                displayName: "TOON",
                displayNameSource: "ADMIN_OVERRIDE",
                displayNameUpdatedAt: new Date(),
                isBetaAllowed: true,
                isApproved: true,
                isActive: true,
                isBanned: false,
                onboardingComplete: true,
              },
              create: {
                email,
                name: "TOON",
                displayName: "TOON",
                displayNameSource: "ADMIN_OVERRIDE",
                displayNameUpdatedAt: new Date(),
                role: "TOON",
                isBetaAllowed: true,
                isApproved: true,
                isActive: true,
                isBanned: false,
                onboardingComplete: true,
                guidelinesAcceptedAt: new Date(),
                profileSlug: "toon",
              },
            });

            return user;
          },
        }),
      ]
    : []),
  ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
    ? [
        DiscordProvider({
          clientId: process.env.DISCORD_CLIENT_ID,
          clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
      ]
    : []),
];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const profileWithId = profile as { id?: string } | undefined;
      const discordId =
        account?.provider === "discord"
          ? account.providerAccountId
          : typeof profileWithId?.id === "string"
            ? profileWithId.id
            : undefined;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            ...(user.email ? [{ email: user.email }] : []),
            ...(discordId ? [{ discordId }] : []),
          ],
        },
        select: {
          isActive: true,
          isBanned: true,
        },
      });

      return existingUser ? existingUser.isActive && !existingUser.isBanned : true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;

        const discordId = account?.provider === "discord" ? account.providerAccountId : undefined;
        const discordName = typeof user.name === "string" ? user.name.trim() : "";
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            displayName: true,
            displayNameSource: true,
            displayNameUpdatedAt: true,
          },
        });

        const displayName =
          existingUser?.displayNameSource === "ADMIN_OVERRIDE"
            ? existingUser.displayName
            : discordName || existingUser?.displayName || user.email || "Electric Crew member";

        await prisma.user.update({
          where: { id: user.id },
          data: {
            ...(discordId ? { discordId } : {}),
            ...(user.image ? { avatarUrl: user.image } : {}),
            displayName,
            displayNameUpdatedAt: existingUser?.displayNameUpdatedAt || new Date(),
          },
        });
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: String(token.id) },
          select: {
            role: true,
            avatarUrl: true,
            image: true,
            bio: true,
            displayName: true,
            isBetaAllowed: true,
            isApproved: true,
            isActive: true,
            isBanned: true,
            onboardingComplete: true,
          },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.avatarUrl = dbUser.avatarUrl || dbUser.image || null;
          token.bio = dbUser.bio;
          token.displayName = dbUser.displayName;
          token.isBetaAllowed = dbUser.isBetaAllowed;
          token.isApproved = dbUser.isApproved;
          token.isActive = dbUser.isActive;
          token.isBanned = dbUser.isBanned;
          token.onboardingComplete = dbUser.onboardingComplete;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role as typeof session.user.role;
        session.user.avatarUrl = typeof token.avatarUrl === "string" ? token.avatarUrl : null;
        session.user.bio = typeof token.bio === "string" ? token.bio : null;
        session.user.displayName = typeof token.displayName === "string" ? token.displayName : null;
        session.user.isBetaAllowed = Boolean(token.isBetaAllowed);
        session.user.isApproved = Boolean(token.isApproved);
        session.user.isActive = token.isActive !== false;
        session.user.isBanned = Boolean(token.isBanned);
        session.user.onboardingComplete = Boolean(token.onboardingComplete);
      }

      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);
