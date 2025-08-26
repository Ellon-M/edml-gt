// components/AdminHeaderActions.tsx
"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHeaderActions() {
  const { data: session, status } = useSession();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await signOut({ redirect: false });
    } catch (err) {
      console.error(err);
    } finally {
      router.push("/admin/login");
    }
  }

  if (status === "loading") {
    return <div className="hidden sm:inline-block w-24 h-8 bg-gray-100 rounded animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Link href="/admin/login" className="text-sm px-3 py-1 border rounded hover:bg-gray-50">
        Admin login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleSignOut} className="text-sm px-3 py-1 bg-[#800000] text-white rounded hover:bg-[#6e0000]">
        Logout
      </button>
    </div>
  );
}
