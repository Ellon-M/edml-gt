// components/ForgotPasswordForm.tsx
"use client";

import React, { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setResetUrl(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const js = await res.json();
      if (!res.ok) {
        setError(js?.error ?? "Failed to request reset");
        return;
      }

      if (js.resetUrl) {
        setResetUrl(js.resetUrl);
        setMessage("Reset link generated (returned for testing). Use it to open the reset page.");
      } else {
        setMessage(js?.message ?? "If an account exists, instructions will be sent.");
      }
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
          placeholder="you@example.com"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md border text-sm bg-[#800000] text-white hover:bg-[#6e0000] disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send reset link"}
      </button>

      {message && (
        <div className="rounded-md p-3 text-sm bg-green-50 text-green-800 border border-green-100">
          {message}
        </div>
      )}

      {resetUrl && (
        <div className="rounded-md p-3 bg-gray-50 border border-gray-100 text-sm">
          <div className="font-medium mb-1">Temporary reset link (dev):</div>
          <div className="break-all text-xs">{resetUrl}</div>
          <div className="mt-2">
            <a
              href={resetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm font-medium text-[#800000] hover:underline"
            >
              Open reset page
            </a>
          </div>
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
