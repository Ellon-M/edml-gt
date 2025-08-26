// lib/admin.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdminServer() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session) return null;
    const role = (session?.user as any)?.role;
    if (role === "ADMIN" || role === "SUPERUSER") return session;
    return null;
  } catch (err) {
    // Log during runtime but never throw during import
    console.error("requireAdminServer error:", err);
    return null;
  }
}
