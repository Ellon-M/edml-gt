// app/sign-up/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import { ArrowLeft, ShieldCheck, Users } from "lucide-react";

export default function SignUp() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-7xl w-full grid gap-8 grid-cols-1 lg:grid-cols-2 items-center">
        {/* LEFT: marketing / benefits panel (desktop only) */}
        <aside className="hidden lg:flex flex-col justify-center gap-6 px-8">
          <div className="max-w-lg">
            <h1 className="text-4xl font-extrabold leading-tight text-[#630f0f]">
              Create your free account
            </h1>
            <p className="mt-3 text-gray-600 text-lg">
              Join today to manage bookings, save favorite places, and receive
              personalized offers. It’s fast, secure, and built for modern
              travelers.
            </p>

            <ul className="mt-6 grid gap-3">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-[#800000] text-white">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-medium">Secure & private</div>
                  <div className="text-sm text-gray-500">
                    We protect your data and don’t share it without consent.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 text-gray-600">
                  <Users className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-medium">Easy to manage</div>
                  <div className="text-sm text-gray-500">
                    Dashboard for bookings, messages, and saved properties.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="w-full h-56 rounded-lg overflow-hidden bg-gradient-to-br from-[#fff3f3] to-white flex items-center justify-center text-[#800000] font-semibold">
              Promo / Illustration
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Pro tip: Sign up with Google to finish in seconds — we’ll prefill
              your profile details.
            </p>
          </div>
        </aside>

        {/* RIGHT: signup card */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" /><span className="hover:underline"> Home</span>
                </Link>
                <h2 className="text-2xl font-bold text-gray-900">
                  Create your account
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the form to get started — or use Google for instant
                  signup.
                </p>
              </div>
            </div>

            {/* Signup form component (keeps validations and Google button inside) */}
            <div className="mb-4">
              <SignupForm />
            </div>

            {/* OAuth fallback (visual) */}
            <div className="space-y-2">
              <p className="text-xs text-center text-gray-400">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="text-[#800000] hover:underline">
                  Terms & Conditions
                </Link>
                .
              </p>
            </div>

            {/* footer: sign in link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account?</span>{" "}
              <Link
                href="/login"
                className="text-[#800000] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
