"use client";

import { ReactNode } from "react";

type ColorVariant = "blue" | "indigo" | "purple" | "green" | "emerald" | "red" | "orange" | "teal";

type Props = {
  icon: ReactNode;
  title: string;
  value: string | number;
  sub?: string;
  badge?: string;
  color?: ColorVariant;
  loading?: boolean;
};

const colorConfig: Record<ColorVariant, { gradient: string }> = {
  indigo:  { gradient: "from-indigo-600 to-indigo-500" },
  blue:    { gradient: "from-blue-600 to-blue-500" },
  purple:  { gradient: "from-blue-600 to-blue-500" },
  green:   { gradient: "from-green-600 to-green-500" },
  emerald: { gradient: "from-emerald-600 to-emerald-500" },
  red:     { gradient: "from-red-600 to-red-500" },
  orange:  { gradient: "from-amber-500 to-orange-400" },
  teal:    { gradient: "from-teal-600 to-teal-500" },
};

export default function SummaryCard({
  icon,
  title,
  value,
  sub,
  badge,
  color = "indigo",
  loading = false,
}: Props) {
  if (loading) {
    return (
      <div className="bg-gray-100 rounded-2xl p-5 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 rounded-xl mb-3" />
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  const { gradient } = colorConfig[color];

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <div className="w-5 h-5">{icon}</div>
        </div>
        {badge && (
          <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-white/70 mb-1">{title}</p>
      <p className="text-xl font-bold leading-tight">{value}</p>
      {sub && <p className="text-xs text-white/60 mt-0.5">{sub}</p>}
    </div>
  );
}