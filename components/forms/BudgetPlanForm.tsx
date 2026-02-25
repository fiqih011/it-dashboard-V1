"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import { showError, showSuccess } from "@/lib/swal";

type Props = {
  mode: "edit" | "create";
  initialData?: {
    id?: string;
    displayId?: string;
    year: number;
    coa: string;
    category: string;
    component: string;
    budgetPlanAmount: number;
    budgetRealisasiAmount: number;
    budgetRemainingAmount: number;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

const inputClass =
  "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-gray-300";
const disabledClass =
  "w-full px-3 py-2.5 border border-gray-100 rounded-xl text-sm text-gray-500 bg-gray-50 cursor-not-allowed";
const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";

export default function BudgetPlanForm({ mode, initialData, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: initialData?.id,
    year: initialData?.year ?? new Date().getFullYear(),
    coa: initialData?.coa ?? "",
    category: initialData?.category ?? "",
    component: initialData?.component ?? "",
    budgetPlanAmount:
      initialData?.budgetPlanAmount !== undefined ? String(initialData.budgetPlanAmount) : "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.coa.trim() || !form.category.trim() || !form.component.trim() || form.budgetPlanAmount === "") {
      showError("Required fields are incomplete");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/budget/opex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          year: form.year,
          coa: form.coa,
          category: form.category,
          component: form.component,
          budgetPlanAmount: Number(form.budgetPlanAmount),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to save data");
      showSuccess(mode === "edit" ? "Budget Plan OPEX updated successfully" : "Budget Plan OPEX created successfully");
      onSuccess();
    } catch (err) {
      showError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Basic Information ── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Basic Information</p>
        <div className="space-y-4">
          {initialData?.displayId && (
            <div>
              <label className={labelClass}>Budget ID</label>
              <input disabled value={initialData.displayId} className={disabledClass} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>COA <span className="text-red-400">*</span></label>
              <input
                value={form.coa}
                onChange={(e) => setForm({ ...form, coa: e.target.value })}
                className={inputClass}
                placeholder="e.g. 911"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category <span className="text-red-400">*</span></label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
                placeholder="e.g. IT Project"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Component <span className="text-red-400">*</span></label>
              <input
                value={form.component}
                onChange={(e) => setForm({ ...form, component: e.target.value })}
                className={inputClass}
                placeholder="e.g. Professional Fee"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Budget Information ── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Budget Information</p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Budget Plan Amount <span className="text-red-400">*</span></label>
            <input
              type="number"
              placeholder="Enter budget amount"
              value={form.budgetPlanAmount}
              onChange={(e) => setForm({ ...form, budgetPlanAmount: e.target.value })}
              className={`${inputClass} text-right`}
              required
            />
          </div>
          {initialData && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Realization</label>
                <input
                  disabled
                  value={Number(initialData.budgetRealisasiAmount).toLocaleString("id-ID")}
                  className={`${disabledClass} text-right`}
                />
              </div>
              <div>
                <label className={labelClass}>Remaining</label>
                <input
                  disabled
                  value={Number(initialData.budgetRemainingAmount).toLocaleString("id-ID")}
                  className={`${disabledClass} text-right`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-40"
        >
          <X className="w-4 h-4 inline mr-1.5" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 flex items-center gap-2 transition"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
          ) : (
            <><Save className="w-4 h-4" />Save</>
          )}
        </button>
      </div>
    </form>
  );
}