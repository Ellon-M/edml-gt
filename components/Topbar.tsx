"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Search, Bell } from "lucide-react";

const Topbar: React.FC = () => {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 border-b">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <div
          className="text-xl font-semibold hidden lg-block"
          style={{ color: "var(--color-primary)" }}
        >
          Dashboard
        </div>
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2">
          <Search size={14} />
          <input
            className="bg-transparent outline-none text-sm"
            placeholder="Search properties or reservations..."
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-md hover:bg-gray-50">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded">
            3
          </span>
        </button>

        <div className="flex items-center gap-2">
          {/* Avatar */}
          <img
            src={
              user?.image ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user?.name || "U") +
                "&background=random"
            }
            alt={user?.name || "User"}
            className="w-8 h-8 rounded-full border"
          />

          {/* User info */}
          <div className="text-sm text-right">
            <div className="font-medium">{user?.name || "Guest"}</div>
            <div className="text-xs text-gray-500">{user?.email || "No email"}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
