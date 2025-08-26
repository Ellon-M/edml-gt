// next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: RoleType;
      phone?: string | null;
      country?: string | null;
      dob?: string | null; // ISO string in session
      companyName?: string | null;
      // bank fields
      bankName?: string | null;
      bankBranchCode?: string | null;
      bankAccountNumber?: string | null;
      bankAccountName?: string | null;
      bankCurrency?: string | null;
      bankVerified?: boolean | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: RoleType;
    phone?: string | null;
    country?: string | null;
    dob?: Date | null;
    companyName?: string | null;
    bankName?: string | null;
    bankBranchCode?: string | null;
    bankAccountNumber?: string | null;
    bankAccountName?: string | null;
    bankCurrency?: string | null;
    bankVerified?: boolean | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "PARTNER" | "ADMIN" | "SUPERUSER";
    companyName?: string;
  }
}
