// components/ResetPasswordForm.tsx
"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const emailFromQuery = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token || !emailFromQuery) {
      setError("Missing token or email in URL.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, email: emailFromQuery, password }),
      });
      const js = await res.json();
      if (!res.ok) {
        setError(js?.error ?? "Failed to reset password");
        return;
      }
      setMessage("Password reset successful. You can now sign in with your new password.");
      setPassword("");
      setConfirm("");
    } catch (err: any) {
      setError(err?.message ?? "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="mt-1 text-sm text-gray-600">{emailFromQuery || "—"}</div>
      </div>

      <label className="block">
        <div className="text-sm font-medium text-gray-700">New password</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-[#800000]"
          placeholder="Enter new password"
        />
      </label>

      <label className="block">
        <div className="text-sm font-medium text-gray-700">Confirm password</div>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={6}
          className="mt-1 w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-[#800000]"
          placeholder="Confirm new password"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md border text-sm bg-[#800000] text-white hover:bg-[#6e0000] disabled:opacity-60"
      >
        {loading ? "Resetting..." : "Reset password"}
      </button>

      {message && (
        <div className="rounded-md p-3 text-sm bg-green-50 text-green-800 border border-green-100">
          {message} <a href="/login" className="ml-2 text-[#800000] hover:underline">Sign in</a>
        </div>
      )}

      {error && (
        <div className="rounded-md p-3 text-sm bg-red-50 text-red-800 border border-red-100">
          {error}
        </div>
      )}
    </form>
  );
}
