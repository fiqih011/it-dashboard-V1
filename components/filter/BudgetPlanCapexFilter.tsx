"use client";

import { useEffect, useState } from "react";
import { Filter, ChevronDown, Search, X } from "lucide-react";
import SearchableSelect from "@/components/ui/SearchableSelect";
import type { BudgetPlanCapexFilterValue } from "./types";

type Options = {
  years: string[];
  budgetDisplayIds: string[];
  itemCodes: string[];
  itemDescriptions: string[];
  noCapexList: string[];
  itemRemarks: string[];
};

type Props = {
  value: BudgetPlanCapexFilterValue;
  onChange: (value: BudgetPlanCapexFilterValue) => void;
  onSearch: () => void;
  onReset: () => void;
};

export default function BudgetPlanCapexFilter({ value, onChange, onSearch, onReset }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [options, setOptions] = useState<Options>({
    years: [], budgetDisplayIds: [], itemCodes: [],
    itemDescriptions: [], noCapexList: [], itemRemarks: [],
  });

  const activeCount = Object.values(value).filter((v) => v && v.trim() !== "").length;

  // ── Fetch options on mount with current year as default ──
  useEffect(() => {
    fetchOptions(value.year);
  }, []);

  // ── Re-fetch contextual options when year changes ──
  useEffect(() => {
    fetchOptions(value.year);
  }, [value.year]);

  async function fetchOptions(year?: string) {
    try {
      const params = new URLSearchParams();
      if (year) params.set("year", year);
      const res = await fetch(`/api/budget/capex/filter-options?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setOptions({
        years: data.years ?? [],
        budgetDisplayIds: data.budgetDisplayIds ?? [],
        itemCodes: data.itemCodes ?? [],
        itemDescriptions: data.itemDescriptions ?? [],
        noCapexList: data.noCapexList ?? [],
        itemRemarks: data.itemRemarks ?? [],
      });
    } catch (err) {
      console.error("[BudgetPlanCapexFilter] fetchOptions error:", err);
    }
  }

  const handleYearChange = (v: string | undefined) => {
    // Reset all other filters when year changes
    onChange({ year: v });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* ── Header toggle ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <div className={`transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`}>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </div>
          <div className="text-left">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              Filter Budget Plan
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Search by year, budget ID, item code, description, no CAPEX, or remark
            </p>
          </div>
        </div>

        {activeCount > 0 && (
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-full">
            {activeCount} Active Filter{activeCount > 1 ? "s" : ""}
          </span>
        )}
      </button>

      {/* ── Content ── */}
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-100">
          <div className="flex gap-4 mb-5">
            {/* Tahun */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tahun</label>
              <SearchableSelect
                value={value.year}
                options={options.years}
                placeholder="Select Year"
                onChange={handleYearChange}
              />
            </div>

            {/* Budget ID */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget ID</label>
              <SearchableSelect
                value={value.budgetDisplayId}
                options={options.budgetDisplayIds}
                placeholder="Select Budget ID"
                onChange={(v) => onChange({ ...value, budgetDisplayId: v })}
              />
            </div>

            {/* Item Code */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Code</label>
              <SearchableSelect
                value={value.itemCode}
                options={options.itemCodes}
                placeholder="Select Item Code"
                onChange={(v) => onChange({ ...value, itemCode: v })}
              />
            </div>

            {/* Item Description */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Description</label>
              <SearchableSelect
                value={value.itemDescription}
                options={options.itemDescriptions}
                placeholder="Select Description"
                onChange={(v) => onChange({ ...value, itemDescription: v })}
              />
            </div>

            {/* No CAPEX */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">No CAPEX</label>
              <SearchableSelect
                value={value.noCapex}
                options={options.noCapexList}
                placeholder="Select No CAPEX"
                onChange={(v) => onChange({ ...value, noCapex: v })}
              />
            </div>

            {/* Item Remark */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Remark</label>
              <SearchableSelect
                value={value.itemRemark}
                options={options.itemRemarks}
                placeholder="Select Item Remark"
                onChange={(v) => onChange({ ...value, itemRemark: v })}
              />
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onSearch}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <Search className="w-4 h-4" />
              Apply Filters
            </button>

            <button
              onClick={() => { onReset(); fetchOptions(); }}
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>

            {activeCount > 0 && (
              <span className="text-sm text-gray-500 ml-auto">
                {activeCount} Filter Applied{activeCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}