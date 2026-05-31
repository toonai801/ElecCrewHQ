import { redirect } from "next/navigation";
import type { RoleName } from "@/lib/sample-data";
import { auth } from "@/lib/auth";

export const roleRank: Record<RoleName, number> = {
  MEMBER: 1,
  TRUSTED_CREW: 2,
  MODERATOR: 3,
  ADMIN: 4,
  TOON: 5,
};

export function hasRole(role: RoleName | undefined, allowed: RoleName[]) {
  return !!role && allowed.includes(role);
}

export function canManageEvents(role?: RoleName) {
  return hasRole(role, ["TOON", "ADMIN"]);
}

export function canModeratePosts(role?: RoleName) {
  return hasRole(role, ["TOON", "ADMIN", "MODERATOR"]);
}

export function canManageUsers(role?: RoleName) {
  return hasRole(role, ["TOON", "ADMIN"]);
}

export function canAutoApprovePosts(role?: RoleName) {
  return hasRole(role, ["TOON", "ADMIN", "MODERATOR", "TRUSTED_CREW"]);
}

export async function requireRole(allowed: RoleName[]) {
  const session = await auth();
  const role = session?.user.role as RoleName | undefined;

  if (!session?.user || !hasRole(role, allowed)) {
    redirect("/login?locked=1");
  }

  return { session, role };
}
