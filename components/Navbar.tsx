// components/Navbar.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Info,
  PlusCircle,
  HelpCircle,
  Book,
  LifeBuoy,
  Grid,
  LogOut,
  User,
  FileText,
  Heart,
  Calendar,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image src="/edm-listings-no-bg.png" alt="Edmor Logo" width={150} height={50} priority />
          </Link>

          {/* Desktop Menu (kept as NavigationMenu for consistency) */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavLinks isMobile={false} />
            </NavigationMenu>
          </div>
        </div>

        {/* Right: actions (desktop) */}
        <div className="flex items-center gap-3">
          {/* If loading session, small skeleton */}
          {status === "loading" ? (
            <div className="hidden md:block w-28 h-10 rounded-full bg-gray-100 animate-pulse" />
          ) : session?.user ? (
            <UserMenu session={session} />
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#800000] text-white font-semibold hover:brightness-95"
            >
              <PlusCircle size={16} /> <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setIsOpen((s) => !s)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.18 }}
            className="md:hidden w-full bg-[#800000] text-white shadow-md"
          >
            <div className="px-6 py-6">
              <NavigationMenu>
                <NavLinks isMobile={true} />
              </NavigationMenu>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* -------------------------
   Desktop/mobile nav links
   ------------------------- */
function NavLinks({ isMobile }: { isMobile: boolean }) {
  return (
    <NavigationMenuList>
      <div className={isMobile ? "flex flex-col space-y-4" : "flex items-center gap-6"}>
        <NavigationMenuItem>
          <NavItem href="/properties" icon={Home} label="Latest Listings" isMobile={isMobile} />
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavItem href="/help-center" icon={Info} label="Contact Support" isMobile={isMobile} />
        </NavigationMenuItem>

        {isMobile && (
          <>
            <NavigationMenuItem>
              <NavItem href="/help-center" icon={HelpCircle} label="FAQs" isMobile={isMobile} />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavItem href="/blog" icon={Book} label="Blog" isMobile={isMobile} />
            </NavigationMenuItem>
          </>
        )}
      </div>
    </NavigationMenuList>
  );
}

function NavItem({ href, icon: Icon, label, isMobile }: { href: string; icon: any; label: string; isMobile: boolean; }) {
  return (
    <Link href={href} className={isMobile ? "flex items-center gap-3 text-base" : "flex items-center gap-2 text-sm hover:text-[#800000]"}>
      {isMobile && <Icon size={18} />}
      <span>{label}</span>
    </Link>
  );
}

/* -------------------------
   Authenticated user menu
   ------------------------- */
function UserMenu({ session }: { session: any }) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  // close on outside click or Escape
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const name = session.user?.name ?? session.user?.email ?? "User";
  const email = session.user?.email ?? "";
  const image = session.user?.image ?? null;
  const initials = (name || "U").split(" ").map((s: string) => s[0]).slice(0,2).join("").toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex items-center gap-3 rounded-full border border-gray-100 px-3 py-1 hover:shadow-sm focus:ring-2 focus:ring-[#800000]/30"
      >
        {/* Avatar */}
        {image ? (
          <Image src={image} alt={name} width={36} height={36} className="rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
            {initials}
          </div>
        )}

        {/* name (hidden on small screens) */}
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-sm font-medium text-gray-800">{name}</span>
          <span className="text-xs text-gray-500">{email}</span>
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
            style={{ zIndex: 60 }}
          >
            <div className="px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                {image ? (
                  <Image src={image} alt={name} width={44} height={44} className="rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 px-3 py-1 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">{initials}</div>
                )}
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{name}</div>
                  <div className="text-xs text-gray-500 truncate">{email}</div>
                </div>
              </div>
            </div>

            <div className="py-2">
              <MenuLink href="/dashboard" icon={Grid} label="Partner dashboard" onClick={() => setOpen(false)} />
              <MenuLink href="/dashboard/properties" icon={FileText} label="My properties" onClick={() => setOpen(false)} />
              <MenuLink href="/dashboard/reservations" icon={Calendar} label="My reservations" onClick={() => setOpen(false)} />
              <MenuLink href="/dashboard/reviews" icon={Heart} label="My reviews" onClick={() => setOpen(false)} />
              <MenuLink href="/account" icon={User} label="Account" onClick={() => setOpen(false)} />
            </div>

            <div className="border-t px-3 py-2">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* small helper for menu links inside dropdown */
function MenuLink({ href, icon: Icon, label, onClick }: { href: string; icon: any; label: string; onClick?: () => void; }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50">
      <Icon size={16} className="text-gray-600" /> <span className="text-gray-800">{label}</span>
    </Link>
  );
}
