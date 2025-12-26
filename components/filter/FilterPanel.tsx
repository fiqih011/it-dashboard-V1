// components/filter/FilterPanel.tsx
"use client";

import Button from "@/components/ui/Button";

type FilterField = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "select";
  options?: { label: string; value: string }[];
};

type FilterPanelProps = {
  fields: FilterField[];
  onSearch?: () => void;
  onReset?: () => void;
};

export default function FilterPanel({
  fields,
  onSearch,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="border rounded bg-white p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1">
            <label className="text-xs text-gray-600">{f.label}</label>

            {f.type === "select" ? (
              <select className="w-full rounded border px-2 py-1 text-sm">
                <option value="">All</option>
                {f.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder={f.placeholder}
                className="w-full rounded border px-2 py-1 text-sm"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={onSearch}>Search</Button>
        <Button variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
