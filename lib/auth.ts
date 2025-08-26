// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@site.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("InvalidCredentials");
        }

        const email = credentials.email.toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("UserNotFound");
        if (!user.password) throw new Error("NoPasswordSet");

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("InvalidCredentials");

        // Return the minimal user here; NextAuth will handle creating session
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          // include optional fields so they get added to token on sign-in
          phone: user.phone,
          country: user.country,
          dob: user.dob ? user.dob.toISOString() : undefined,
          companyName: user.companyName,
          bankName: user.bankName,
          bankBranchCode: user.bankBranchCode,
          bankAccountNumber: user.bankAccountNumber,
          bankAccountName: user.bankAccountName,
          bankCurrency: user.bankCurrency,
          bankVerified: user.bankVerified,
        } as any;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // on sign-in, NextAuth provides `user` — copy fields to the token
      if (user) {
        const u = user as any;
        token.role = u.role ?? token.role;
        token.phone = u.phone ?? token.phone;
        token.country = u.country ?? token.country;
        token.dob = u.dob ?? token.dob;
        token.companyName = u.companyName ?? token.companyName;
        token.bankName = u.bankName ?? token.bankName;
        token.bankBranchCode = u.bankBranchCode ?? token.bankBranchCode;
        token.bankAccountNumber = u.bankAccountNumber ?? token.bankAccountNumber;
        token.bankAccountName = u.bankAccountName ?? token.bankAccountName;
        token.bankCurrency = u.bankCurrency ?? token.bankCurrency;
        token.bankVerified = typeof u.bankVerified !== "undefined" ? u.bankVerified : token.bankVerified;
        return token;
      }

      // subsequent requests: if some fields are missing, fetch them from DB
      if (!token.role || !token.bankAccountNumber /* any field you want to guarantee */) {
        try {
          if (token.sub) {
            const dbUser = await prisma.user.findUnique({
              where: { id: token.sub },
            });
            if (dbUser) {
              token.role = token.role ?? (dbUser.role as any);
              token.phone = token.phone ?? dbUser.phone ?? undefined;
              token.country = token.country ?? dbUser.country ?? undefined;
              token.dob = token.dob ?? (dbUser.dob ? dbUser.dob.toISOString() : undefined);
              token.companyName = token.companyName ?? dbUser.companyName ?? undefined;
              token.bankName = token.bankName ?? dbUser.bankName ?? undefined;
              token.bankBranchCode = token.bankBranchCode ?? dbUser.bankBranchCode ?? undefined;
              token.bankAccountNumber = token.bankAccountNumber ?? dbUser.bankAccountNumber ?? undefined;
              token.bankAccountName = token.bankAccountName ?? dbUser.bankAccountName ?? undefined;
              token.bankCurrency = token.bankCurrency ?? dbUser.bankCurrency ?? undefined;
              token.bankVerified = typeof token.bankVerified === "undefined" ? dbUser.bankVerified : token.bankVerified;
            }
          }
        } catch (err) {
          console.error("Failed to populate jwt with user fields:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // attach the extra fields to session.user
      (session.user as any).role = (token as any).role;
      (session.user as any).phone = (token as any).phone;
      (session.user as any).country = (token as any).country;
      (session.user as any).dob = (token as any).dob; // ISO string
      (session.user as any).companyName = (token as any).companyName;
      (session.user as any).bankName = (token as any).bankName;
      (session.user as any).bankBranchCode = (token as any).bankBranchCode;
      (session.user as any).bankAccountNumber = (token as any).bankAccountNumber;
      (session.user as any).bankAccountName = (token as any).bankAccountName;
      (session.user as any).bankCurrency = (token as any).bankCurrency;
      (session.user as any).bankVerified = (token as any).bankVerified;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
