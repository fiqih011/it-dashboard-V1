"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const [query, setQuery] = useState(value ?? "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value ?? "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center border border-gray-300 rounded-md h-9 px-3 bg-white cursor-text"
        onClick={() => setOpen(true)}
      >
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value || undefined);
            setOpen(true);
          }}
          placeholder={placeholder}
          className="flex-1 text-sm outline-none bg-transparent"
        />
        <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
      </div>

      {open && filteredOptions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {filteredOptions.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                setQuery(opt);
                onChange(opt);
                setOpen(false);
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
