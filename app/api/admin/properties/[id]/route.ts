// app/api/admin/properties/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminServer } from "@/lib/admin";

export async function DELETE(req: NextRequest, context: any) {
  // requireAdminServer uses try/catch internally
  const session = await requireAdminServer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // handle params robustly (string | string[])
  const rawId = context?.params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    return NextResponse.json({ error: "MissingId" }, { status: 400 });
  }

  try {
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("admin/properties DELETE error:", err);
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }
    return NextResponse.json({ error: "ServerError" }, { status: 500 });
  }
}
