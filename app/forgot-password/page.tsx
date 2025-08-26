// app/forgot-password/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" /> <span className="hover:underline">Back to sign in</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 my-2">Forgot your password?</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter the email associated with your account and we'll send instructions to reset your password.
            (In dev we return the reset link in the API response so you can test quickly.)
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
}
