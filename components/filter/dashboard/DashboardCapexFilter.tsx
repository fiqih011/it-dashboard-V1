"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, X, Filter } from "lucide-react";
import SearchableSelect from "@/components/ui/SearchableSelect";

// =====================================================
// TYPE DEFINITIONS
// =====================================================
export interface DashboardCapexFilterValue {
  year: string;
  budgetId: string;
  itemCode: string;
  itemDescription: string;
  noCapex: string;
  itemRemark: string;
}

export interface DashboardCapexFilterOptions {
  years: string[];
  budgetIds: string[];
  itemCodes: string[];
  itemDescriptions: string[];
  noCapexList: string[];
  itemRemarks: string[];
}

interface DashboardCapexFilterProps {
  value: DashboardCapexFilterValue;
  options: DashboardCapexFilterOptions;
  onChange: (value: DashboardCapexFilterValue) => void;
  onSearch: () => void;
  onReset: () => void;
}

// =====================================================
// COMPONENT
// =====================================================
export default function DashboardCapexFilter({
  value,
  options,
  onChange,
  onSearch,
  onReset,
}: DashboardCapexFilterProps) {
  const [isOpen, setIsOpen] = useState(true);

  const activeCount = Object.values(value).filter(
    (v) => typeof v === "string" && v.trim() !== ""
  ).length;

  const handleFieldChange = (
    field: keyof DashboardCapexFilterValue,
    newValue: string
  ) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  const handleReset = () => {
    onReset();
    setIsOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* ================= HEADER ================= */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors rounded-2xl"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}

          <div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-gray-800">
                Filter Dashboard
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Search by year, budget ID, item code, description, CAPEX number,
              or remark
            </p>
          </div>
        </div>

        {activeCount > 0 && (
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
            {activeCount} Active{" "}
            {activeCount === 1 ? "Filter" : "Filters"}
          </span>
        )}
      </button>

      {/* ================= CONTENT ================= */}
      {isOpen && (
        <div className="px-6 pb-5 pt-1 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Year
              </label>
              <SearchableSelect
                value={value.year}
                onChange={(val) => handleFieldChange("year", val || "")}
                options={options.years}
                placeholder="Select year"
              />
            </div>

            {/* Budget ID */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Budget ID
              </label>
              <SearchableSelect
                value={value.budgetId}
                onChange={(val) => handleFieldChange("budgetId", val || "")}
                options={options.budgetIds}
                placeholder="Select Budget ID"
              />
            </div>

            {/* Item Code */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Item Code
              </label>
              <SearchableSelect
                value={value.itemCode}
                onChange={(val) => handleFieldChange("itemCode", val || "")}
                options={options.itemCodes}
                placeholder="Select Item Code"
              />
            </div>

            {/* Item Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Item Description
              </label>
              <SearchableSelect
                value={value.itemDescription}
                onChange={(val) =>
                  handleFieldChange("itemDescription", val || "")
                }
                options={options.itemDescriptions}
                placeholder="Select Item Description"
              />
            </div>

            {/* No CAPEX */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                No CAPEX
              </label>
              <SearchableSelect
                value={value.noCapex}
                onChange={(val) => handleFieldChange("noCapex", val || "")}
                options={options.noCapexList}
                placeholder="Select No CAPEX"
              />
            </div>

            {/* Item Remark */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Item Remark
              </label>
              <SearchableSelect
                value={value.itemRemark}
                onChange={(val) => handleFieldChange("itemRemark", val || "")}
                options={options.itemRemarks}
                placeholder="Select Item Remark"
              />
            </div>
          </div>

          {/* ================= ACTIONS ================= */}
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
              <span className="text-xs text-gray-400">
                {activeCount} Filter{activeCount > 1 ? "s" : ""} Applied
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}