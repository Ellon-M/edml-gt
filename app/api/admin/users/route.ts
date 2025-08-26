// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminServer } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const session = await requireAdminServer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const role = url.searchParams.get("role") ?? undefined;

    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { companyName: { contains: q, mode: "insensitive" } },
      ];
    }
    if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        country: true,
        dob: true,
        companyName: true,
        createdAt: true,
        updatedAt: true,
      },
      take: 1000,
    });

    return NextResponse.json({ ok: true, users });
  } catch (err) {
    console.error("admin/users GET", err);
    return NextResponse.json({ error: "ServerError" }, { status: 500 });
  }
}
