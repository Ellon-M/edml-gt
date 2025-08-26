// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const token = String(body?.token ?? "");
    const newPassword = String(body?.password ?? "");

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: "MissingFields" }, { status: 400 });
    }

    // find matching token record
    const record = await prisma.verificationToken.findFirst({
      where: { identifier: email, token },
    });

    if (!record) {
      return NextResponse.json({ error: "InvalidOrExpiredToken" }, { status: 400 });
    }

    if (record.expires < new Date()) {
      // cleanup expired token
      await prisma.verificationToken.deleteMany({ where: { identifier: email } });
      return NextResponse.json({ error: "InvalidOrExpiredToken" }, { status: 400 });
    }

    // find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "UserNotFound" }, { status: 404 });
    }

    // hash new password and update
    const hashed = bcrypt.hashSync(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    // remove tokens for this identifier
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "ServerError" }, { status: 500 });
  }
}
