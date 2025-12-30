"use client";

export type BudgetPlanFilter = {
  year: string;
  id: string;
  coa: string;
  component: string;
};

export type FilterPanelProps = {
  value: BudgetPlanFilter;
  onChange: (value: BudgetPlanFilter) => void;
  onSearch: () => void;
  onReset: () => void;
};

export default function FilterPanel({
  value,
  onChange,
  onSearch,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="border rounded p-4 space-y-3 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-600">Tahun</label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            value={value.year}
            onChange={(e) =>
              onChange({ ...value, year: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs text-gray-600">ID</label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            value={value.id}
            onChange={(e) =>
              onChange({ ...value, id: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs text-gray-600">COA</label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            value={value.coa}
            onChange={(e) =>
              onChange({ ...value, coa: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs text-gray-600">
            Component
          </label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            value={value.component}
            onChange={(e) =>
              onChange({
                ...value,
                component: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSearch}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
        >
          Search
        </button>

        <button
          onClick={onReset}
          className="px-3 py-1 text-sm bg-gray-200 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
