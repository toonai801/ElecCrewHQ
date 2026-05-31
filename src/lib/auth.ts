import { getServerSession, type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { isBetaAllowed } from "@/lib/beta-lock";

const providers =
  process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
    ? [
        DiscordProvider({
          clientId: process.env.DISCORD_CLIENT_ID,
          clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
      ]
    : [];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "database",
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
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.avatarUrl = user.avatarUrl || user.image || null;
        session.user.isBetaAllowed = user.isBetaAllowed;
      }

      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);
