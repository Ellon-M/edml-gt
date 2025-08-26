// lib/admin.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdminServer() {
  const session = await getServerSession(authOptions as any);
  if (!session) return null;
  const role = (session.user as any)?.role;
  if (!role) return null;
  // allow ADMIN and SUPERUSER
  if (role === "ADMIN" || role === "SUPERUSER") return session;
  return null;
}
