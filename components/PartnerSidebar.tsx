// components/PartnerSidebar.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  CalendarCheck,
  Wallet,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import clsx from "clsx";
import ToggleIcon from "./ToggleIcon";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/reservations", label: "Reservations", icon: CalendarCheck },
  { href: "/dashboard/properties", label: "Properties", icon: ImageIcon },
  { href: "/dashboard/finance", label: "Finance", icon: Wallet },
];

export default function PartnerSidebar() {
  const { data: session } = useSession();
  const user = session?.user;
  const [isOpen, setIsOpen] = useState(true); // desktop collapsed state
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer shown
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  // close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prevent body scroll when mobile drawer open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
  }, [mobileOpen]);

    async function handleSignOut() {
    // signs out and returns to /login
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <>
      {/* Mobile hamburger (top-left). z is high so it's always visible. */}
      <div className="lg:hidden fixed z-[80] top-4 left-4">
        <ToggleIcon open={mobileOpen} onToggle={() => setMobileOpen((s) => !s)} />
      </div>

      {/* Desktop sidebar */}
      <aside
        className={clsx(
          "hidden lg:flex flex-col h-screen border-r bg-white transition-all duration-300 sticky top-0",
          isOpen ? "w-72" : "w-20"
        )}
      >
        <div className="flex items-center justify-between px-4 py-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              style={{ backgroundColor: "var(--color-primary)" }}
              className="w-10 h-10 rounded-md flex items-center justify-center text-white font-semibold"
            >
              {(user?.name)?.charAt(0)}
            </div>
            {isOpen && (
              <div>
                <div className="font-bold">{user?.name} (Edmor Listings Partner)</div>
                <div className="text-sm text-gray-500 truncate">{user?.companyName}</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen((s) => !s)}
            className="p-1 rounded-md hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="block">
              <span
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-50 cursor-pointer",
                  !isOpen && "justify-center"
                )}
              >
                <Icon size={18} />
                {isOpen && <span>{label}</span>}
              </span>
            </Link>
          ))}
        </nav>

        {/* Desktop sidebar footer (replace the existing footer block with this) */}
      <div className="px-4 py-4 border-t bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
            {user?.name?.[0] ?? "U"}
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name ?? "Guest User"}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email ?? "guest@example.com"}</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-base text-black"
        >
          <LogOut size={18} /> <span className="">{isOpen && <span>Sign out</span>}</span>
        </button>
      </div>
      </aside>

      {/* Mobile drawer + blurred backdrop */}
      <div
        aria-hidden={!mobileOpen}
        className={clsx(
          // full-screen wrapper ensures consistent stacking
          "fixed inset-0 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        style={{ zIndex: 70 }}
      >
        {/* Backdrop: below drawer (z 70), clickable to close */}
        <div
          onClick={() => setMobileOpen(false)}
          className={clsx(
            "absolute inset-0 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          style={{ zIndex: 72 }}
        >
          <div className="w-full h-full bg-white/30 backdrop-blur-sm" />
        </div>

        {/* Drawer: sits above backdrop, receives clicks */}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()} // important: clicks inside drawer should not bubble to backdrop
          className={clsx(
            "absolute left-0 top-0 h-full bg-white border-r shadow-xl transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          style={{ width: 320, zIndex: 75 }}
        >
          <div className="flex items-center px-6 py-6 border-b">
            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: "var(--color-primary)" }}
                className="w-10 h-10 rounded-md flex items-center justify-center text-white font-semibold"
              >
                {(user?.name)?.charAt(0)}
              </div>
              <div>
                <div className="font-bold">{user?.name} (Edmor Listings Partner)</div>
                <div className="text-sm text-gray-500">{user?.companyName}</div>
              </div>
            </div>
          </div>

          {/* NAV: use Link with className so Next renders a real <a> */}
          <nav className="px-3 mt-4">
            <ul className="space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-50">
                      <Icon size={18} /> <span>{label}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-6 py-6 border-t bg-gray-50 mt-auto">
            <div className="text-sm font-medium">{user?.name ?? "Guest User"}</div>
            <div className="text-xs text-gray-500">{user?.email ?? "guest@example.com"}</div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-base text-black"
        >
          <LogOut size={18} /> <span className="">Sign out</span>
        </button>
      </div>
        </div>
      </div>
    </>
  );
}
