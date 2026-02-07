"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

type Props = {
  value?: string;
  options: string[];
  placeholder?: string;
  onChange: (value?: string) => void;
};

export default function SearchableSelect({
  value,
  options,
  placeholder,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  const displayValue = open ? query : value ?? "";

  // ✅ Clear handler for X button
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center border border-gray-300 rounded-md h-9 px-3 bg-white cursor-text"
        onClick={() => setOpen(true)}
      >
        <input
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className="flex-1 text-sm outline-none bg-transparent"
        />
        
        {/* ✅ Clear button (X) - shows when value exists and dropdown is closed */}
        {value && !open && (
          <button
            onClick={handleClear}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            type="button"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        <ChevronDown className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-md border bg-white shadow-lg">
          {filtered.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
                setQuery("");
              }}
              className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}