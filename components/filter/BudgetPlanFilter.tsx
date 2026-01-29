"use client";

import type { BudgetPlanFilterValue } from "./types";
import Button from "@/components/ui/Button";
import SearchableSelect from "@/components/ui/SearchableSelect";

type Props = {
  value: BudgetPlanFilterValue;
  options: {
    year: string[];
    displayId: string[];
    coa: string[];
    category: string[];
    component: string[];
  };
  onChange: (value: BudgetPlanFilterValue) => void;
  onSearch: () => void;
  onReset: () => void;
};

export default function BudgetPlanFilter({
  value,
  options,
  onChange,
  onSearch,
  onReset,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {/* FILTER GRID — SAMA DENGAN CAPEX */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {/* ROW 1 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Tahun
          </label>
          <SearchableSelect
            value={value.year}
            options={options.year}
            placeholder="Pilih Tahun"
            onChange={(v) => onChange({ ...value, year: v })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Budget ID
          </label>
          <SearchableSelect
            value={value.displayId}
            options={options.displayId}
            placeholder="Ketik / pilih Budget ID"
            onChange={(v) =>
              onChange({ ...value, displayId: v })
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            COA
          </label>
          <SearchableSelect
            value={value.coa}
            options={options.coa}
            placeholder="Ketik / pilih COA"
            onChange={(v) => onChange({ ...value, coa: v })}
          />
        </div>

        {/* ROW 2 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Category
          </label>
          <SearchableSelect
            value={value.category}
            options={options.category}
            placeholder="Ketik / pilih Category"
            onChange={(v) =>
              onChange({ ...value, category: v })
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Component
          </label>
          <SearchableSelect
            value={value.component}
            options={options.component}
            placeholder="Ketik / pilih Component"
            onChange={(v) =>
              onChange({ ...value, component: v })
            }
          />
        </div>
      </div>

      {/* ACTION */}
      <div className="mt-4 flex gap-2">
        <Button variant="primary" onClick={onSearch}>
          Search
        </Button>
        <Button variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
