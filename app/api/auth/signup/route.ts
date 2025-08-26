// app/api/auth/signup/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
      phone,       // expected in format: "+254" and number combined or server will combine
      country,
      dob,         // expected YYYY-MM-DD or ISO date string
      companyName,
    } = body;

    // Basic server-side validation
    if (!email || !password) {
      return NextResponse.json({ error: "MissingFields" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "EmailExists" }, { status: 409 });
    }

    // Hash password
    const hashed = bcrypt.hashSync(String(password), 10);

    // Parse DOB to Date, if provided
    let dobDate = null;
    if (dob) {
      const parsed = new Date(dob);
      if (!isNaN(parsed.getTime())) dobDate = parsed;
    }

    // Compose phone if an object provided or only-number
    let storedPhone: string | undefined = undefined;
    if (phone) {
      // expected client sends normalized phone like "+254123456789" or { countryCode: '+254', number: '712345678' }
      if (typeof phone === "string") {
        storedPhone = phone;
      } else if (typeof phone === "object" && phone.countryCode && phone.number) {
        storedPhone = `${phone.countryCode}${String(phone.number).replace(/\D/g, "")}`;
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashed,
        role: "PARTNER", // default signup role
        phone: storedPhone ?? undefined,
        country: country ?? null,
        dob: dobDate,
        emailVerified: "false",
        companyName: companyName ?? null,
      },
      select: { id: true, email: true },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "ServerError" }, { status: 500 });
  }
}
