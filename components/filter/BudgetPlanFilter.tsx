"use client";

import { BudgetPlanFilterValue } from "./types";
import { budgetPlanFilterConfig } from "./budgetPlan.config";

type Props = {
  value: BudgetPlanFilterValue;
  onChange: (value: BudgetPlanFilterValue) => void;
  onSearch: () => void;
  onReset: () => void;
};

export default function BudgetPlanFilter({
  value,
  onChange,
  onSearch,
  onReset,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {/* ========================= */}
      {/* FILTER INPUTS — 1 BARIS */}
      {/* ========================= */}
      <div className="grid grid-cols-12 gap-3">
        {budgetPlanFilterConfig.map((field) => (
          <div
            key={String(field.key)}
            className="col-span-2"
          >
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {field.label}
            </label>

            <input
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              value={(value as any)[field.key] ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  [field.key]: e.target.value,
                })
              }
              className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      {/* ========================= */}
      {/* ACTION BUTTONS — BARIS 2 */}
      {/* ========================= */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onSearch}
          className="h-9 px-5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>

        <button
          type="button"
          onClick={onReset}
          className="h-9 px-5 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
