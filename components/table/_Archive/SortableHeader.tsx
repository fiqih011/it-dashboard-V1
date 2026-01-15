// components/table/SortableHeader.tsx
"use client";

import { ChevronUp, ChevronDown } from "lucide-react";

export type SortDirection = "asc" | "desc" | null;

type Props = {
  label: string;
  value: SortDirection;
  onChange: (next: SortDirection) => void;
  align?: "left" | "right" | "center";
};

export default function SortableHeader({
  label,
  value,
  onChange,
  align = "left",
}: Props) {
  function handleClick() {
    if (value === null) onChange("asc");
    else if (value === "asc") onChange("desc");
    else onChange(null);
  }

  const alignClass =
    align === "right"
      ? "text-right"
      : align === "center"
      ? "text-center"
      : "text-left";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900 ${alignClass}`}
    >
      <span>{label}</span>

      <span className="flex flex-col leading-none">
        <ChevronUp
          className={`h-3 w-3 ${
            value === "asc" ? "text-gray-900" : "text-gray-300"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            value === "desc" ? "text-gray-900" : "text-gray-300"
          }`}
        />
      </span>
    </button>
  );
}
