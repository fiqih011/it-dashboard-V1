"use client";

import { ReactNode } from "react";

/**
 * =====================================================
 * SUMMARY CARD - ENTERPRISE STANDARD
 * =====================================================
 * Summary cards BOLEH pakai warna solid (highlight area)
 * 
 * Total Budget    : bg-blue-600 (blue)
 * Total Realisasi : bg-violet-600 (purple variant)
 * Remaining       : bg-emerald-600 (green)
 * 
 * Text: text-white, text-gray-200
 */

type ColorVariant = "blue" | "purple" | "green" | "emerald" | "red" | "orange" | "teal";

type Props = {
  icon: ReactNode;
  title: string;
  value: string | number;
  badge?: string;
  color?: ColorVariant;
  loading?: boolean;
};

const colorConfig: Record<ColorVariant, {
  gradient: string;
  shadow: string;
}> = {
  blue: {
    gradient: "from-blue-600 to-blue-700",
    shadow: "shadow-blue-600/20",
  },
  purple: {
    gradient: "from-violet-600 to-violet-700",
    shadow: "shadow-violet-600/20",
  },
  green: {
    gradient: "from-green-600 to-green-700",
    shadow: "shadow-green-600/20",
  },
  emerald: {
    gradient: "from-emerald-600 to-emerald-700",
    shadow: "shadow-emerald-600/20",
  },
  red: {
    gradient: "from-red-600 to-red-700",
    shadow: "shadow-red-600/20",
  },
  orange: {
    gradient: "from-orange-600 to-orange-700",
    shadow: "shadow-orange-600/20",
  },
  teal: {
    gradient: "from-teal-600 to-teal-700",
    shadow: "shadow-teal-600/20",
  },
};

export default function SummaryCard({
  icon,
  title,
  value,
  badge,
  color = "blue",
  loading = false,
}: Props) {
  const config = colorConfig[color];

  if (loading) {
    return (
      <div className="bg-slate-100 rounded-xl shadow-md p-6 animate-pulse border border-gray-200">
        <div className="space-y-3">
          <div className="h-4 bg-slate-300 rounded w-3/4"></div>
          <div className="h-8 bg-slate-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${config.gradient}
        rounded-xl shadow-lg ${config.shadow}
        p-6 text-white
        border border-white/10
        transform hover:scale-[1.02] hover:shadow-xl
        transition-all duration-300 ease-out
      `}
    >
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-black/5"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header: Icon & Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 shadow-md">
            <div className="w-6 h-6">
              {icon}
            </div>
          </div>
          {badge && (
            <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
              <span className="text-sm font-bold tracking-wide text-white">
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* Title & Value */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
            {title}
          </h3>
          <p className="text-2xl font-bold tracking-tight text-white">
            {value}
          </p>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"></div>
    </div>
  );
}