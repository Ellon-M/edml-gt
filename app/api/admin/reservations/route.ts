// app/api/admin/reservations/route.ts
import { NextResponse } from "next/server";
import { requireAdminServer } from "@/lib/admin";

export async function GET() {
  const session = await requireAdminServer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // no reservations implemented yet
  return NextResponse.json({ ok: true, reservations: [] });
}
