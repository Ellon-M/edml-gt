// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireAdminServer } from "@/lib/admin";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminServer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = params.id;
    const payload = await req.json();

    // forbid changing these fields by admin edit form
    const forbidden = [
      "email",
      "role",
      "bankName",
      "bankBranchCode",
      "bankAccountNumber",
      "bankAccountName",
      "bankCurrency",
      "bankVerified",
    ];
    for (const f of forbidden) delete payload[f];

    if (payload.password) {
      payload.password = bcrypt.hashSync(String(payload.password), 10);
    }

    if (payload.dob) {
      const parsed = new Date(payload.dob);
      if (!isNaN(parsed.getTime())) payload.dob = parsed;
      else delete payload.dob;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: payload,
      select: { id: true, name: true, email: true, role: true, phone: true, country: true, dob: true, companyName: true },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (err: any) {
    console.error("admin/users PATCH", err);
    if (err?.code === "P2025") return NextResponse.json({ error: "NotFound" }, { status: 404 });
    return NextResponse.json({ error: "ServerError" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminServer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = params.id;
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
    if (!user) return NextResponse.json({ error: "NotFound" }, { status: 404 });

    // do not allow deletion of other ADMIN or SUPERUSER users
    if (user.role === "ADMIN" || user.role === "SUPERUSER") {
      return NextResponse.json({ error: "CannotDeleteAdmin" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("admin/users DELETE", err);
    return NextResponse.json({ error: "ServerError" }, { status: 500 });
  }
}
