// app/login/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function Login() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-7xl w-full grid gap-8 grid-cols-1 lg:grid-cols-2 items-center">
        {/* LEFT: friendly marketing / welcome panel */}
        <aside className="hidden lg:flex flex-col justify-center gap-6 px-12">
          <div className="max-w-lg">
            <h1 className="text-3xl font-extrabold leading-tight text-gray-900">
              Welcome back 👋
            </h1>
            <p className="mt-3 text-gray-600 text-lg">
              Sign in to manage your bookings, save favorites, and get tailored
              recommendations. Fast, secure, and built for travelers.
            </p>

            <ul className="mt-6 grid gap-3">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-[#800000] text-white">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-medium">Secure by default</div>
                  <div className="text-sm text-gray-500">
                    Two-step auth and encrypted sessions.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 text-gray-600">
                  ⭐
                </span>
                <div>
                  <div className="font-medium">Personalized experience</div>
                  <div className="text-sm text-gray-500">
                    See suggestions and offers tailored to you.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* decorative / illustrative area */}
          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="w-full h-56 rounded-lg overflow-hidden bg-gradient-to-br from-[#ffecee] to-white flex items-center justify-center text-[#800000] font-semibold">
              Illustration / Promo
            </div>
            <p className="mt-3 text-sm text-gray-500">
              New here? Create an account to get the best personalized results
              and manage bookings easily.
            </p>
          </div>
        </aside>

        {/* RIGHT: login card */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" /> <span className="hover:underline">Back</span>
                </Link>
                <h2 className="text-2xl font-bold text-gray-900 my-2">
                  Sign in to your account
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your credentials to continue — or use Google for a
                  faster sign-in.
                </p>
              </div>
            </div>

            {/* form (keeps your LoginForm component) */}
            <div className="mb-4">
              <LoginForm />
            </div>

            {/* footer: sign up link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don’t have an account?</span>{" "}
              <Link
                href="/sign-up"
                className="text-[#800000] font-semibold hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
