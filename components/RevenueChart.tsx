// components/dashboard/RevenueChart.tsx
"use client";

import React from "react";

function formatCurrency(n: number) {
  return "KSh " + n.toLocaleString();
}

export default function RevenueChart({ data }: { data: number[] }) {
  const width = 600;
  const height = 140;
  const padding = 24;

  if (!data || data.length === 0) {
    return <div className="text-sm text-gray-500">No revenue data</div>;
  }

  // compute scales
  const max = Math.max(...data);
  const min = Math.min(...data);
  const len = data.length;

  const x = (i: number) =>
    padding + (i / Math.max(1, len - 1)) * (width - padding * 2);
  const y = (v: number) => {
    if (max === min) return height - padding;
    return padding + ((max - v) / (max - min)) * (height - padding * 2);
  };

  const points = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  // area path
  const areaPath =
    `M ${x(0)} ${height - padding} L ${points} L ${x(len - 1)} ${height - padding} Z`;

  // line path
  const linePath = data.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");

  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffecd2" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padding}
            x2={width - padding}
            y1={padding + t * (height - 2 * padding)}
            y2={padding + t * (height - 2 * padding)}
            stroke="#eef2f7"
            strokeWidth={1}
          />
        ))}

        {/* area */}
        <path d={areaPath} fill="url(#areaGradient)" stroke="none" />

        {/* line */}
        <path d={linePath} stroke="#ef4444" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* points */}
        {data.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r={3} fill="#ef4444" />
            <title>{formatCurrency(v)}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}
