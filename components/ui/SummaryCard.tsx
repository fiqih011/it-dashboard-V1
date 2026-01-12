"use client";

import React from "react";
import clsx from "clsx";

export type ColorVariant = "blue" | "indigo" | "emerald";

type Props = {
  icon: React.ReactNode;
  title: string;
  value: string;
  badge?: string;
  color?: ColorVariant;
  loading?: boolean;
};

const COLOR_MAP: Record<ColorVariant, string> = {
  blue: "from-blue-500 to-blue-600",
  indigo: "from-indigo-500 to-indigo-600",
  emerald: "from-emerald-500 to-emerald-600",
};

export default function SummaryCard({
  icon,
  title,
  value,
  badge,
  color = "blue",
  loading = false,
}: Props) {
  return (
    <div
      className={clsx(
        "relative rounded-xl shadow-md text-white overflow-hidden",
        "bg-gradient-to-r",
        COLOR_MAP[color]
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {/* LEFT */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/90">
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>

          <div className="text-2xl font-bold tracking-tight">
            {loading ? "Loading…" : value}
          </div>
        </div>

        {/* RIGHT BADGE */}
        {badge && (
          <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20">
            {badge}
          </div>
        )}
      </div>

      {/* SUBTLE BOTTOM ACCENT */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/25" />
    </div>
  );
}
