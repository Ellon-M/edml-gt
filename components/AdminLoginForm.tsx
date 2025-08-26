// components/AdminLoginForm.tsx
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use NextAuth signIn with credentials provider.
      // This assumes you have credentials provider configured in next-auth.
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      } as any);

      if (!res) {
        setError("Sign in failed.");
        return;
      }

      // next-auth returns an error string in `res.error` when redirect: false
      if ((res as any).error) {
        setError((res as any).error || "Invalid credentials");
        return;
      }

      // Successful sign in — redirect to admin dashboard.
      router.push("/admin");
    } catch (err: any) {
      setError(err?.message ?? "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <div className="text-sm font-medium text-gray-700">Email</div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-[#800000]"
          placeholder="admin@example.com"
        />
      </label>

      <label className="block">
        <div className="text-sm font-medium text-gray-700">Password</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-[#800000]"
          placeholder="••••••••"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md border text-sm bg-[#800000] text-white hover:bg-[#6e0000] disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      {error && (
        <div className="rounded-md p-3 text-sm bg-red-50 text-red-800 border border-red-100">
          {error}
        </div>
      )}
    </form>
  );
}
