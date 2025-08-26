// app/api/admin/properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminServer } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const session = await requireAdminServer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const filter = url.searchParams.get("filter") ?? "";

    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { country: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    if (filter === "featured") where.featured = true;

    const props = await prisma.property.findMany({
      where,
      include: { images: { orderBy: { order: "asc" } }, owner: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
      take: 500,
    });

    return NextResponse.json({ ok: true, properties: props });
  } catch (err) {
    console.error("admin/properties GET", err);
    return NextResponse.json({ error: "ServerError" }, { status: 500 });
  }
}
