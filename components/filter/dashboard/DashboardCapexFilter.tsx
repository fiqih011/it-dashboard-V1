"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import Button from "@/components/ui/Button";
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

  const handleFieldChange = (field: keyof DashboardCapexFilterValue, newValue: string) => {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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

            {/* Item Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Code
              </label>
              <SearchableSelect
                value={value.itemCode}
                onChange={(val) => handleFieldChange("itemCode", val || "")}
                options={options.itemCodes}
                placeholder="Pilih Item Code"
              />
            </div>

            {/* Item Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Description
              </label>
              <SearchableSelect
                value={value.itemDescription}
                onChange={(val) => handleFieldChange("itemDescription", val || "")}
                options={options.itemDescriptions}
                placeholder="Pilih Item Description"
              />
            </div>

            {/* No CAPEX */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No CAPEX
              </label>
              <SearchableSelect
                value={value.noCapex}
                onChange={(val) => handleFieldChange("noCapex", val || "")}
                options={options.noCapexList}
                placeholder="Pilih No CAPEX"
              />
            </div>

            {/* Item Remark */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Remark
              </label>
              <SearchableSelect
                value={value.itemRemark}
                onChange={(val) => handleFieldChange("itemRemark", val || "")}
                options={options.itemRemarks}
                placeholder="Pilih Item Remark"
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