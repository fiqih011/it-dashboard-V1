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
    "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  let variantClass = "";

  if (variant === "primary") {
    variantClass =
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500";
  }

  if (variant === "secondary") {
    variantClass =
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400";
  }

  if (variant === "danger") {
    // 🔥 SOLID RED (Logout)
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