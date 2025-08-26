"use client";

import React, { useState } from "react";
import * as Icons from "lucide-react";
import { isValidEmail } from "@/lib/utils";
import Link from 'next/link';
import OAuthButton from "./OAuthButton";
import Input from "./Input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm({ onLogin }: { onLogin?: (values: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  function validate() {
    const e: any = {};
    if (!email) e.email = "Email is required.";
    else if (!isValidEmail(email)) e.email = "Please enter a valid email.";
    if (!password) e.password = "Password is required.";
    return e;
  }

  function friendlyMessageFromErrorCode(code?: string | null) {
    switch (code) {
      case "UserNotFound":
        return "No account found with that email. Please sign up.";
      case "InvalidCredentials":
      case "CredentialsSignin":
        return "Invalid email or password.";
      case "NoPasswordSet":
        return "This account was created with Google. Please sign in with Google.";
      default:
        if (code) return `Sign in failed: ${code}`;
        return "Sign in failed. Please try again.";
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ev = validate();
    setErrors(ev);
    if (Object.keys(ev).length) return;
    setLoading(true);

    try {
      const res = (await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      })) as { error?: string | null; ok?: boolean; status?: number } | undefined;

      if (!res) {
        const msg = "Sign in failed. Please try again.";
        setErrors({ form: msg });
        alert(msg);
        return;
      }

      if (res.ok) {
        onLogin?.({ email });
        router.replace("/dashboard");
        return;
      }

      // Not ok -> handle error codes
      const friendly = friendlyMessageFromErrorCode(res.error);
      setErrors({ form: friendly });
      //alert(friendly);
    } catch (err) {
      console.error("Login error:", err);
      const msg = "An unexpected error occurred. Please try again.";
      setErrors({ form: msg });
      // alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input
        id="login-email"
        label="Email"
        placeholder="you@example.com"
        icon={<Icons.Mail className="w-4 h-4" />}
        value={email}
        onChange={(ev: any) => setEmail(ev.target.value)}
        error={errors.email}
        autoComplete="email"
      />

      <div>
        <label htmlFor="login-password" className="text-sm font-medium text-gray-700 mb-1 block">
          Password
        </label>
        <div className={`relative rounded-md shadow-sm ${errors.password ? "ring-1 ring-red-300" : ""}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icons.Lock className="w-4 h-4" />
          </div>

          <input
            id="login-password"
            name="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="block w-full pl-10 pr-10 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#800000]/30 focus:border-[#800000]"
            autoComplete="current-password"
            placeholder="Your password"
          />

          <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute inset-y-0 right-0 pr-2 flex items-center" aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <Icons.EyeOff className="w-4 h-4 text-gray-500" /> : <Icons.Eye className="w-4 h-4 text-gray-500" />}
          </button>
        </div>
        {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4" /> <span>Remember me</span>
        </label>
        <Link className="text-sm text-[#800000] hover:underline" href="/forgot-password">
          Forgot password?
        </Link>
      </div>

      {errors.form ? <p className="text-xs text-red-600">{errors.form}</p> : null}

      <div className="space-y-3">
        <button type="submit" className="w-full rounded-md px-4 py-2 text-white font-semibold bg-[#800000] hover:bg-[#6b0000] disabled:opacity-60" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* divider */}
        <div className="flex items-center gap-3 mt-1 mb-3">
          <div className="flex-1 h-px bg-gray-100" />
          <div className="text-xs text-gray-400">or continue with</div>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <OAuthButton provider="google" onClick={() => signIn("google")} />
      </div>
    </form>
  );
}
