"use client";

import { ReactNode } from "react";

type Props = {
  open: boolean;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
};

export default function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  size = "md",
}: Props) {
  if (!open) return null;

  const sizeClass =
    size === "sm"
      ? "max-w-md"
      : size === "lg"
      ? "max-w-4xl"
      : "max-w-2xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`bg-white w-full ${sizeClass} rounded shadow`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold text-sm">{title}</div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-sm"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 text-sm">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 border-t flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
