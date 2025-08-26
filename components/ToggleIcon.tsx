// components/ToggleIcon.tsx
"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

export default function ToggleIcon({
  open,
  onToggle,
  size = 44,
}: {
  open: boolean;
  onToggle: () => void;
  size?: number;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={open ? "Close navigation" : "Open navigation"}
      className={clsx(
        "w-[44px] h-[44px] rounded-full flex items-center justify-center transition-shadow duration-200",
        "bg-white/90 shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ffecec]"
      )}
    >
      <span className="relative w-6 h-6 block">
        <Menu
          size={20}
          className={clsx(
            "absolute inset-0 transition-transform duration-300",
            open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
          )}
        />
        <X
          size={20}
          className={clsx(
            "absolute inset-0 transition-transform duration-300",
            open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
          )}
        />
      </span>
    </button>
  );
}
