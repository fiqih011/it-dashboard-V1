"use client";

import type { BudgetPlanCapexFilterValue } from "./types";
import Button from "@/components/ui/Button";
import SearchableSelect from "@/components/ui/SearchableSelect";

type Props = {
  value: BudgetPlanCapexFilterValue;
  options: {
    year: string[];
    budgetDisplayId: string[];
    itemCode: string[];
    itemDescription: string[];
    noCapex: string[];
    itemRemark: string[];
  };
  onChange: (value: BudgetPlanCapexFilterValue) => void;
  onSearch: () => void;
  onReset: () => void;
};

export default function BudgetPlanCapexFilter({
  value,
  options,
  onChange,
  onSearch,
  onReset,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {/* FILTER GRID */}
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
            value={value.budgetDisplayId}
            options={options.budgetDisplayId}
            placeholder="Ketik / pilih Budget ID"
            onChange={(v) =>
              onChange({ ...value, budgetDisplayId: v })
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Item Code
          </label>
          <SearchableSelect
            value={value.itemCode}
            options={options.itemCode}
            placeholder="Ketik / pilih Item Code"
            onChange={(v) =>
              onChange({ ...value, itemCode: v })
            }
          />
        </div>

        {/* ROW 2 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Item Description
          </label>
          <SearchableSelect
            value={value.itemDescription}
            options={options.itemDescription}
            placeholder="Ketik / pilih Description"
            onChange={(v) =>
              onChange({ ...value, itemDescription: v })
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            No CAPEX
          </label>
          <SearchableSelect
            value={value.noCapex}
            options={options.noCapex}
            placeholder="Ketik / pilih No CAPEX"
            onChange={(v) =>
              onChange({ ...value, noCapex: v })
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Item Remark
          </label>
          <SearchableSelect
            value={value.itemRemark}
            options={options.itemRemark}
            placeholder="Ketik / pilih Item Remark"
            onChange={(v) =>
              onChange({ ...value, itemRemark: v })
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
