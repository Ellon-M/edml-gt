// lib/serverAuth.ts
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET ?? "";

export async function requireRole(req: NextRequest, requiredRole: "PARTNER" | "ADMIN" | "SUPERUSER") {
  const token = await getToken({ req, secret });
  if (!token) return { ok: false, status: 401, message: "Unauthenticated" };

  const role = (token as any).role as string | undefined;
  if (!role) return { ok: false, status: 403, message: "Role not present" };

  if (role !== requiredRole) return { ok: false, status: 403, message: "Forbidden" };

  return { ok: true, token };
}
