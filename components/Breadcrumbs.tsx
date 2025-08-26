import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-centerjustify-center align-middle gap-1 text-xs md:text-sm text-gray-600">
        {items.map((it, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center justify-center">
              {it.href && !isLast ? (
                <Link href={it.href} className="hover:underline hover:text-[#800000]">
                  {it.label}
                </Link>
              ) : (
                <span className={isLast ? "text-gray-900 font-medium" : "text-gray-500"}>{it.label}</span>
              )}

              {!isLast && <ChevronRight className="w-4 h-4 text-gray-600 mx-0.5 lg:mx-1" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
