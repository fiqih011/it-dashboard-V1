"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import Button from "@/components/ui/Button";
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

  const handleFieldChange = (field: keyof DashboardOpexFilterValue, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  const handleSearch = () => {
    onSearch();
    // Optional: auto-collapse after search for better UX
    // setIsOpen(false);
  };

  const handleReset = () => {
    onReset();
    setIsOpen(true);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* ================= HEADER (TOGGLE) ================= */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
          <h2 className="text-base font-semibold text-gray-900">Filter</h2>
        </div>

        {/* Active filter count badge */}
        {Object.values(value).filter(Boolean).length > 0 && (
          <span className="inline-flex items-center justify-center h-6 px-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-200">
            {Object.values(value).filter(Boolean).length} aktif
          </span>
        )}
      </button>

      {/* ================= FILTER CONTENT ================= */}
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Tahun */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun
              </label>
              <SearchableSelect
                value={value.year}
                onChange={(val) => handleFieldChange("year", val || "")}
                options={options.years}
                placeholder="Pilih tahun"
              />
            </div>

            {/* Budget ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget ID
              </label>
              <SearchableSelect
                value={value.budgetId}
                onChange={(val) => handleFieldChange("budgetId", val || "")}
                options={options.budgetIds}
                placeholder="Pilih Budget ID"
              />
            </div>

            {/* COA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                COA
              </label>
              <SearchableSelect
                value={value.coa}
                onChange={(val) => handleFieldChange("coa", val || "")}
                options={options.coas}
                placeholder="Pilih COA"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <SearchableSelect
                value={value.category}
                onChange={(val) => handleFieldChange("category", val || "")}
                options={options.categories}
                placeholder="Pilih Category"
              />
            </div>

            {/* Component */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Component
              </label>
              <SearchableSelect
                value={value.component}
                onChange={(val) => handleFieldChange("component", val || "")}
                options={options.components}
                placeholder="Pilih Component"
              />
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex items-center gap-3 mt-6">
            <Button
              variant="primary"
              onClick={handleSearch}
              className="inline-flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>

            <Button
              variant="secondary"
              onClick={handleReset}
              className="inline-flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}