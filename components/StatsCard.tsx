// components/dashboard/StatsCard.tsx
import React from "react";
import {
  Home,
  List,
  Calendar,
  Star
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  home: Home,
  list: List,
  calendar: Calendar,
  star: Star,
};

export default function StatsCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  const Icon = ICON_MAP[icon] ?? Home;
  return (
    <div className="bg-white p-3 rounded-md border flex items-center gap-3">
      <div className="p-2 rounded-md bg-[#f7f4f3] text-[#800000]">
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}
