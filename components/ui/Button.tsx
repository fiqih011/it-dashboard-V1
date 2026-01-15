"use client";

import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
}: Props) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  let variantClass = "";

  if (variant === "primary") {
    variantClass =
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
  }

  if (variant === "secondary") {
    // ✅ ENTERPRISE OUTLINE STYLE (TABLE-SAFE)
    variantClass =
      "bg-white text-gray-700 border border-gray-300 hover:bg-slate-100 focus:ring-gray-400";
  }

  if (variant === "danger") {
    variantClass =
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variantClass} ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
