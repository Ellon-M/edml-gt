import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";

// ---------- AuthTabs (switch between Login & Signup) ----------
export default function AuthTabs() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-gray-600 text-sm">Sign in to continue to your account</p>
        </div>
        <div className="flex gap-2 bg-gray-50 rounded-full p-1">
          <button onClick={()=>setTab('login')} className={`px-4 py-2 rounded-full ${tab==='login' ? 'bg-[#800000] text-white' : 'text-gray-600'}`}>Login</button>
          <button onClick={()=>setTab('signup')} className={`px-4 py-2 rounded-full ${tab==='signup' ? 'bg-[#800000] text-white' : 'text-gray-600'}`}>Sign up</button>
        </div>
      </div>

      <div>
        {tab === 'login' ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div><LoginForm onLogin={(v)=>console.log('login',v)} /></div><div className="hidden lg:block p-4 bg-gray-50 rounded-md"><h3 className="font-semibold mb-2">Why sign in?</h3><p className="text-sm text-gray-600">Access your bookings, manage listings, and receive personalized recommendations.</p></div></div> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div><SignupForm onSignup={(v)=>console.log('signup',v)} /></div><div className="hidden lg:block p-4 bg-gray-50 rounded-md"><h3 className="font-semibold mb-2">Create an account</h3><p className="text-sm text-gray-600">Creating an account helps you manage bookings and saves your preferences securely.</p></div></div>}
      </div>
    </div>
  );
}