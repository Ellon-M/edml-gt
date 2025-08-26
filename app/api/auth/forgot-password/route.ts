// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "MissingEmail" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // For testing / dev purposes we return the link only if the user exists.
    // In production you might always return a neutral 'ok' for privacy reasons.
    if (!user) {
      // Do not reveal user existence in production, but returning 200 with a neutral message is OK:
      return NextResponse.json(
        { ok: true, message: "If an account exists, a reset email will be sent." },
        { status: 200 }
      );
    }

    // Remove any old tokens for this identifier (cleanup)
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    // Create a secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Build full URL if we have a base url env var
    const base =
      process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "";
    const resetPath = `/reset-password?token=${encodeURIComponent(
      token
    )}&email=${encodeURIComponent(email)}`;
    const resetUrl = base ? `${base.replace(/\/$/, "")}${resetPath}` : resetPath;

    // Return the reset link in the response (for testing/dev)
    return NextResponse.json({ ok: true, resetUrl }, { status: 200 });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "ServerError" }, { status: 500 });
  }
}
