import type { RoleName } from "@/lib/sample-data";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: RoleName;
    avatarUrl?: string | null;
    bio?: string | null;
    isBetaAllowed?: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      avatarUrl?: string | null;
      bio?: string | null;
      role: RoleName;
      isBetaAllowed: boolean;
    };
  }

  interface User {
    role: RoleName;
    avatarUrl?: string | null;
    bio?: string | null;
    isBetaAllowed: boolean;
  }
}
