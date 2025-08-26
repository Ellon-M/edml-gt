// app/reset-password/page.tsx
"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 my-2">Reset your password</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter a new password to update your account. The link expires in one hour.
          </p>
        </div>

        <Suspense fallback={<div className="py-8 text-center">Loading form…</div>}>
          <ResetPasswordForm />
        </Suspense>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-[#800000] font-semibold hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
