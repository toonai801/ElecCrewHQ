import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { isBetaAllowed } from "@/lib/beta-lock";

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
                isBetaAllowed: true,
                isActive: true,
              },
              create: {
                email,
                name: "TOON",
                role: "TOON",
                isBetaAllowed: true,
                isActive: true,
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

      return isBetaAllowed({
        email: user.email,
        discordId,
        isBetaAllowed: "isBetaAllowed" in user ? Boolean(user.isBetaAllowed) : false,
      });
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatarUrl = user.avatarUrl || user.image || null;
        token.bio = "bio" in user && typeof user.bio === "string" ? user.bio : null;
        token.isBetaAllowed = user.isBetaAllowed;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role as typeof session.user.role;
        session.user.avatarUrl = typeof token.avatarUrl === "string" ? token.avatarUrl : null;
        session.user.bio = typeof token.bio === "string" ? token.bio : null;
        session.user.isBetaAllowed = Boolean(token.isBetaAllowed);
      }

      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);
