"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, X, Filter } from "lucide-react";
import SearchableSelect from "@/components/ui/SearchableSelect";
import type { DashboardOpexFilterValue, DashboardFilterOptions } from "@/types/dashboard";

interface DashboardOpexFilterProps {
  value: DashboardOpexFilterValue;
  options: DashboardFilterOptions;
  onChange: (value: DashboardOpexFilterValue) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function DashboardOpexFilter({
  value,
  options,
  onChange,
  onSearch,
  onReset,
}: DashboardOpexFilterProps) {
  const [isOpen, setIsOpen] = useState(true);

  const activeCount = Object.values(value).filter(Boolean).length;

  const handleFieldChange = (field: keyof DashboardOpexFilterValue, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  const handleReset = () => {
    onReset();
    setIsOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors rounded-2xl"
      >
        <div className="flex items-center gap-3">
          {isOpen
            ? <ChevronUp className="h-4 w-4 text-gray-400" />
            : <ChevronDown className="h-4 w-4 text-gray-400" />
          }
          <div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-gray-800">Filter Dashboard</h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Search by year, budget ID, COA, category, or component</p>
          </div>
        </div>

        {activeCount > 0 && (
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
            {activeCount} Active {activeCount === 1 ? "Filter" : "Filters"}
          </span>
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <div className="px-6 pb-5 pt-1 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Year</label>
              <SearchableSelect
                value={value.year}
                onChange={(val) => handleFieldChange("year", val || "")}
                options={options.years}
                placeholder="Select year"
              />
            </div>

            {/* Budget ID */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Budget ID</label>
              <SearchableSelect
                value={value.budgetId}
                onChange={(val) => handleFieldChange("budgetId", val || "")}
                options={options.budgetIds}
                placeholder="Select Budget ID"
              />
            </div>

            {/* COA */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">COA</label>
              <SearchableSelect
                value={value.coa}
                onChange={(val) => handleFieldChange("coa", val || "")}
                options={options.coas}
                placeholder="Select COA"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
              <SearchableSelect
                value={value.category}
                onChange={(val) => handleFieldChange("category", val || "")}
                options={options.categories}
                placeholder="Select Category"
              />
            </div>

            {/* Component */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Component</label>
              <SearchableSelect
                value={value.component}
                onChange={(val) => handleFieldChange("component", val || "")}
                options={options.components}
                placeholder="Select Component"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-3">
              <button
                onClick={onSearch}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition"
              >
                <Search className="h-4 w-4" />
                Apply Filters
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
            {activeCount > 0 && (
              <span className="text-xs text-gray-400">{activeCount} Filter{activeCount > 1 ? "s" : ""} Applied</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}