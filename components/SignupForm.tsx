// components/SignupForm.tsx
"use client";

import { useState } from "react";
import OAuthButton from "./OAuthButton";
import Input from "./Input";
import { isStrongPassword, isValidEmail } from "@/lib/utils";
import { Eye, EyeOff, User, MapPin, Lock, Calendar, Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const COUNTRY_CODES = [
  { code: "+254", label: "Kenya (+254)" },
  { code: "+1", label: "United States (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+234", label: "Nigeria (+234)" },
  { code: "+255", label: "Tanzania (+255)" },
  { code: "+256", label: "Uganda (+256)" },
  // ...add the countries you need
];

export default function SignupForm({ onSignup }: { onSignup?: (values: any) => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(COUNTRY_CODES[0].code);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  function validatePhone(countryCode: string, number: string) {
    // basic digits-only check; length 7-15 digits typical for international numbers
    const digits = String(number).replace(/\D/g, "");
    if (!digits) return false;
    return digits.length >= 6 && digits.length <= 15;
  }

  function validate() {
    const e: any = {};
    if (!firstName) e.firstName = "First name is required.";
    if (!lastName) e.lastName = "Last name is required.";
    if (!email) e.email = "Email is required.";
    else if (!isValidEmail(email)) e.email = "Please enter a valid email.";
    if (!phoneNumber) e.phone = "Phone number is required.";
    else if (!validatePhone(country, phoneNumber)) e.phone = "Please enter a valid phone number for selected country.";
    if (!country) e.country = "Country code is required.";
    if (!dob) e.dob = "Date of birth is required.";
    if (!password) e.password = "Password is required.";
    else if (!isStrongPassword(password)) e.password = "Password must be at least 8 chars, include upper, lower and a number.";
    if (!confirm) e.confirm = "Please confirm password.";
    else if (password !== confirm) e.confirm = "Passwords do not match.";
    if (!companyName) e.companyName = "Company name is required.";
    if (!agree) e.agree = "You must accept terms & conditions.";
    return e;
  }

  function friendlyMessageFromServerCode(code?: string | null) {
    switch (code) {
      case "EmailExists":
        return "An account with that email already exists. Please sign in or use another email.";
      case "MissingFields":
        return "Missing required fields. Please check the form.";
      case "ServerError":
        return "Could not create account due to a server error. Try again later.";
      default:
        return undefined;
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ev = validate();
    setErrors(ev);
    if (Object.keys(ev).length) return;

    setLoading(true);
    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      // Send phone as object so server composes final stored value
      const payload = {
        name,
        email: email.trim().toLowerCase(),
        password,
        phone: { countryCode: country, number: phoneNumber.trim() },
        country, // countryCode, you may also send country name if desired
        dob, // YYYY-MM-DD from date input
        companyName: companyName.trim(),
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        // email exists
        const data = await res.json().catch(() => ({}));
        const message = friendlyMessageFromServerCode(data?.error) ?? "Email already in use";
        setErrors((p:any) => ({ ...p, server: message }));
        alert(message);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = friendlyMessageFromServerCode(data?.error) ?? "Sign up failed. Please try again.";
        setErrors((p:any) => ({ ...p, server: message }));
        alert(message);
        return;
      }

      // success
      const json = await res.json();
      onSignup?.({ firstName, lastName, email });

      // automatically sign in with credentials provider
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      }) as { error?: string | null; ok?: boolean } | undefined;

      if (signInRes?.ok) {
        router.replace("/dashboard");
        return;
      }

      // if sign-in failed for some reason, show a helpful message
      if (signInRes?.error) {
        alert("Signed up but automatic sign-in failed. Please sign in manually.");
        router.replace("/login");
        return;
      }

      // fallback
      router.replace("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input id="first" label="First name" value={firstName} onChange={(e: any) => setFirstName(e.target.value)} icon={<User className="w-4 h-4" />} error={errors.firstName} />
        <Input id="last" label="Last name" value={lastName} onChange={(e: any) => setLastName(e.target.value)} icon={<User className="w-4 h-4" />} error={errors.lastName} />
      </div>

      <Input id="signup-email" label="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} error={errors.email} autoComplete="email" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Country code select + phone number */}
        <div>
          <label htmlFor="phone-code" className="text-sm font-medium text-gray-700 mb-1 block">Country</label>
          <select id="phone-code" value={country} onChange={(e:any)=>setCountry(e.target.value)} className="block w-full pl-3 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#800000]/30 focus:border-[#800000]">
            {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </div>

        <div>
          <Input id="phone" label="Phone number" value={phoneNumber} onChange={(e:any)=>setPhoneNumber(e.target.value)} icon={<Phone className="w-4 h-4" />} error={errors.phone} placeholder="712345678" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="dob" className="text-sm font-medium text-gray-700 mb-1 block">Date of birth</label>
          <input id="dob" type="date" value={dob} onChange={(e:any)=>setDob(e.target.value)} className={`block w-full pl-3 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#800000]/30 focus:border-[#800000] ${errors.dob ? 'ring-1 ring-red-300' : ''}`} max={new Date().toISOString().split("T")[0]} />
          {errors.dob ? <p className="mt-1 text-xs text-red-600">{errors.dob}</p> : null}
        </div>

        <div>
          <label htmlFor="signup-password" className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
          <div className={`relative rounded-md shadow-sm ${errors.password ? 'ring-1 ring-red-300' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock className="w-4 h-4" /></div>
            <input id="signup-password" name="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Create a password" className="block w-full pl-10 pr-10 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#800000]/30 focus:border-[#800000]" />
            <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute inset-y-0 right-0 pr-2 flex items-center" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
            </button>
          </div>
          {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="confirm" className="text-sm font-medium text-gray-700 mb-1 block">Confirm password</label>
        <input id="confirm" value={confirm} onChange={(e: any) => setConfirm(e.target.value)} placeholder="Repeat password" className="block w-full pl-3 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#800000]/30 focus:border-[#800000]" type="password" />
        {errors.confirm ? <p className="mt-1 text-xs text-red-600">{errors.confirm}</p> : null}
      </div>

      {/* REPLACED: address -> companyName */}
      <div>
        <label htmlFor="company" className="text-sm font-medium text-gray-700 mb-1 block">Company / Business Name</label>
        <input id="company" value={companyName} onChange={(e:any)=>setCompanyName(e.target.value)} placeholder="Company name (e.g., Edmor Group)" className="block w-full pl-3 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#800000]/30 focus:border-[#800000]" />
        {errors.companyName ? <p className="mt-1 text-xs text-red-600">{errors.companyName}</p> : null}
      </div>

      <div className="flex items-start gap-3">
        <input type="checkbox" id="agree" checked={agree} onChange={(e: any) => setAgree(e.target.checked)} className="mt-1" />
        <label htmlFor="agree" className="text-sm">I agree to the <a href="#" className="text-[#800000] hover:underline">Terms & Conditions</a></label>
      </div>
      {errors.agree ? <p className="mt-1 text-xs text-red-600">{errors.agree}</p> : null}
      {errors.server ? <p className="mt-1 text-xs text-red-600">{errors.server}</p> : null}

      <div className="space-y-3">
        <button type="submit" className="w-full rounded-md px-4 py-2 text-white font-semibold bg-[#800000] hover:bg-[#6b0000] disabled:opacity-60" disabled={loading}>
          {loading ? 'Signing up...' : 'Create account'}
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
