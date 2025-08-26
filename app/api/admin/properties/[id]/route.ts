// app/api/admin/properties/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminServer } from "@/lib/admin";

export async function DELETE(req: NextRequest, { params }: any) {
  const session = await requireAdminServer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = params.id;
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("admin/properties DELETE", err);
    if (err?.code === "P2025") return NextResponse.json({ error: "NotFound" }, { status: 404 });
    return NextResponse.json({ error: "ServerError" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminServer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = params.id;
    const body = await req.json();

    const data: any = {};
    if (typeof body.featured === "boolean") data.featured = body.featured;

    const updated = await prisma.property.update({ where: { id }, data });
    return NextResponse.json({ ok: true, property: updated });
  } catch (err: any) {
    console.error("admin/properties PATCH", err);
    if (err?.code === "P2025") return NextResponse.json({ error: "NotFound" }, { status: 404 });
    return NextResponse.json({ error: "ServerError" }, { status: 500 });
  }
}
