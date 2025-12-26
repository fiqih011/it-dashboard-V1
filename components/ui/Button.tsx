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
  let base =
    "px-4 py-2 rounded text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed";

  let variantClass = "";
  if (variant === "primary") {
    variantClass = "bg-blue-600 text-white hover:bg-blue-700";
  }
  if (variant === "secondary") {
    variantClass = "bg-gray-200 text-gray-800 hover:bg-gray-300";
  }
  if (variant === "danger") {
    variantClass = "bg-red-600 text-white hover:bg-red-700";
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
