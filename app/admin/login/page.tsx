// app/admin/login/page.tsx
"use client";

import React from "react";
import AdminLoginForm from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 my-2">Admin sign in</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in with your admin account to access the admin panel.
          </p>
        </div>

        <AdminLoginForm />

        <div className="mt-6 text-center text-sm">
          <a href="/" className="text-gray-600 hover:underline">Back to site</a>
        </div>
      </div>
    </main>
  );
}
