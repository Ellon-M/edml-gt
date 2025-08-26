// app/api/finance/bank/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

const secret = process.env.NEXTAUTH_SECRET ?? "";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret });
    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const {
      bankName,
      bankBranchCode,
      bankAccountNumber,
      bankAccountName,
      bankCurrency,
    } = body;

    // basic server-side validation (you can expand)
    if (!bankName || !bankAccountNumber || !bankAccountName) {
      return NextResponse.json({ error: "Fill out all the missing fields" }, { status: 400 });
    }

    const userId = String(token.sub);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        bankName: bankName ?? undefined,
        bankBranchCode: bankBranchCode ?? undefined,
        bankAccountNumber: bankAccountNumber ?? undefined,
        bankAccountName: bankAccountName ?? undefined,
        bankCurrency: bankCurrency ?? undefined,
        bankVerified: true, // you may want to set this to false and verify externally
      },
      select: {
        id: true,
        email: true,
        name: true,
        bankName: true,
        bankBranchCode: true,
        bankAccountNumber: true,
        bankAccountName: true,
        bankCurrency: true,
        bankVerified: true,
      },
    });

    return NextResponse.json({ ok: true, user: updated }, { status: 200 });
  } catch (err) {
    console.error("Failed to update bank details:", err);
    return NextResponse.json({ error: "ServerError" }, { status: 500 });
  }
}
