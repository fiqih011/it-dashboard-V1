"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { BaseFilterProps, FilterFieldConfig } from "./types";

type Props<T> = BaseFilterProps<T> & {
  fields: FilterFieldConfig<T>[];
};

/**
 * =========================================
 * ICONS
 * =========================================
 */
const Icons = {
  ChevronDown: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
};

export default function BaseFilter<
  T extends Record<string, string | undefined>
>(props: Props<T>) {
  const { value, onChange, onSearch, onReset, fields } = props;

  const [isOpen, setIsOpen] = useState(true);

  const activeFiltersCount = Object.values(value).filter(
    (v) => v && v.trim() !== ""
  ).length;

  function setValue<K extends keyof T>(key: K, val?: string) {
    onChange({
      ...value,
      [key]: val,
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* ===================================== */}
      {/* FILTER HEADER */}
      {/* ===================================== */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <div
            className={`transition-transform duration-200 ${
              isOpen ? "" : "-rotate-90"
            }`}
          >
            <Icons.ChevronDown />
          </div>

          <div className="text-left">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Icons.Filter />
              Filter Transactions
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Search by year, transaction ID, budget ID, vendor, requester, or description
            </p>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-full">
            {activeFiltersCount} Active Filter
            {activeFiltersCount > 1 ? "s" : ""}
          </span>
        )}
      </button>

      {/* ===================================== */}
      {/* FILTER CONTENT */}
      {/* ===================================== */}
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-100">
          <div className="flex gap-4 mb-6">
            {fields.map((field) => (
              <div key={String(field.key)} className="flex-1 min-w-0">
                {field.type === "text" && (
                  <Input
                    label={field.label}
                    placeholder={
                      field.placeholder ?? `Enter ${field.label}`
                    }
                    value={value[field.key] ?? ""}
                    onChange={(val) => setValue(field.key, val)}
                    disabled={false}
                  />
                )}

                {field.type === "select" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <SearchableSelect
                      value={value[field.key]}
                      options={[
                        "",
                        ...(field.options
                          ? field.options.map((o) => o.value)
                          : []),
                      ]}
                      placeholder={
                        field.placeholder ?? `Select ${field.label}`
                      }
                      onChange={(val) =>
                        setValue(field.key, val === "" ? undefined : val)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ===================================== */}
          {/* ACTION BUTTONS */}
          {/* ===================================== */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onSearch}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:shadow transition-all"
            >
              <Icons.Search />
              Apply Filters
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
            >
              <Icons.Close />
              Clear Filters
            </button>

            {activeFiltersCount > 0 && (
              <span className="text-sm text-gray-600 ml-auto">
                {activeFiltersCount} Filter Applied
                {activeFiltersCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
