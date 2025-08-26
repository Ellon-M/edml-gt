// components/AdminHeader.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bell, User, LogOut, Settings, ChevronDown, Menu, X } from "lucide-react";

export default function AdminHeader() {
  const { data: session, status } = useSession();
  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;
  const router = useRouter();

  const [open, setOpen] = useState(false); // dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // mobile nav
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function initials(name?: string, email?: string) {
    if (name) {
      return name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "A";
  }

  async function handleLogout() {
    try {
      await signOut({ redirect: false });
    } catch (err) {
      console.error("signOut error", err);
    } finally {
      router.push("/admin/login");
    }
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/properties", label: "Properties" },
    { href: "/admin/reservations", label: "Reservations" },
  ];

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#800000] text-white flex items-center justify-center font-semibold">
              {initials(user?.name, user?.email)}
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg">Edmor Listings Admin</div>
              <div className="text-xs text-gray-500">Control panel</div>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center text-sm text-gray-600 ml-6">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-gray-900">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right: actions / user */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notification bell */}
          <button aria-label="Notifications" className="relative p-2 rounded-md hover:bg-gray-50" title="Notifications">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>

          {/* Login link when no session */}
          {status !== "loading" && !user && (
            <Link href="/admin/login" className="hidden sm:inline-block text-sm px-3 py-1 border rounded hover:bg-gray-50">
              Admin login
            </Link>
          )}

          {/* User badge */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-3 rounded-md p-1 hover:bg-gray-50"
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
                  {initials(user?.name, user?.email)}
                </div>

                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-sm font-medium text-gray-800 truncate max-w-[160px]">
                    {user?.name ?? user?.email}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-[160px]">{user?.email}</span>
                </div>

                <div className="hidden md:flex items-center ml-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 mr-1">{user?.role ?? "PARTNER"}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-50 overflow-hidden">
                  <div className="p-3 border-b">
                    <div className="text-sm font-medium text-gray-800">{user?.name ?? "Admin"}</div>
                    <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                    <div className="mt-2">
                      <span className="inline-block text-xs bg-gradient-to-r from-yellow-50 to-yellow-100 px-2 py-0.5 rounded text-yellow-800">
                        {user?.role ?? "PARTNER"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Link href="/admin/profile" className="px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" /> Profile
                    </Link>
                    <Link href="/admin/settings" className="px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-gray-600" /> Settings
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
              <div className="w-28 h-4 bg-gray-100 rounded animate-pulse" />
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden p-2 rounded-md hover:bg-gray-50"
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="py-2 px-2 rounded hover:bg-gray-50">
                {l.label}
              </Link>
            ))}

            <div className="mt-2 border-t pt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
                      {initials(user?.name, user?.email)}
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-medium">{user?.name ?? user?.email}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                      <div className="text-xs text-gray-500">{user?.role}</div>
                    </div>
                  </div>

                  <Link href="/admin/profile" className="py-2 px-2 rounded hover:bg-gray-50">Profile</Link>
                  <Link href="/admin/settings" className="py-2 px-2 rounded hover:bg-gray-50">Settings</Link>
                  <button onClick={handleLogout} className="py-2 px-2 rounded text-left text-red-600 hover:bg-gray-50">Logout</button>
                </>
              ) : (
                <Link href="/admin/login" className="py-2 px-2 rounded hover:bg-gray-50">Admin login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
