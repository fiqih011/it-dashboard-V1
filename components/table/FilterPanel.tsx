"use client";

export type FilterState = {
  year: string;
  id: string;
  coa: string;
  component: string;
  vendor?: string;
};

export default function FilterPanel({
  value,
  onChange,
  onSearch,
  onReset,
  showVendor = false,
}: {
  value: FilterState;
  onChange: (v: FilterState) => void;
  onSearch: () => void;
  onReset: () => void;
  showVendor?: boolean;
}) {
  const set = (k: keyof FilterState, v: string) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="mb-4 rounded border p-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <select
          className="border px-2 py-1"
          value={value.year}
          onChange={(e) => set("year", e.target.value)}
        >
          <option value="">Tahun</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>

        <input
          className="border px-2 py-1"
          placeholder="ID"
          value={value.id}
          onChange={(e) => set("id", e.target.value)}
        />

        <input
          className="border px-2 py-1"
          placeholder="COA / Item"
          value={value.coa}
          onChange={(e) => set("coa", e.target.value)}
        />

        <input
          className="border px-2 py-1"
          placeholder="Component"
          value={value.component}
          onChange={(e) => set("component", e.target.value)}
        />

        {showVendor && (
          <input
            className="border px-2 py-1"
            placeholder="Vendor"
            value={value.vendor ?? ""}
            onChange={(e) => set("vendor", e.target.value)}
          />
        )}

        <div className="flex gap-2">
          <button
            onClick={onSearch}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Search
          </button>
          <button
            onClick={onReset}
            className="px-3 py-1 border rounded"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
