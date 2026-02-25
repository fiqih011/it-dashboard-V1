"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import { showError, showSuccess } from "@/lib/swal";

type Props = {
  mode: "edit" | "create";
  initialData?: {
    id?: string;
    budgetDisplayId?: string;
    year: number;
    itemCode: string;
    itemDescription: string;
    noCapex?: string | null;
    itemRemark?: string | null;
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

export default function BudgetPlanCapexForm({ mode, initialData, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: initialData?.id,
    year: initialData?.year ?? new Date().getFullYear(),
    itemCode: initialData?.itemCode ?? "",
    itemDescription: initialData?.itemDescription ?? "",
    noCapex: initialData?.noCapex ?? "",
    itemRemark: initialData?.itemRemark ?? "",
    budgetPlanAmount:
      initialData?.budgetPlanAmount !== undefined ? String(initialData.budgetPlanAmount) : "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.itemCode.trim() || !form.itemDescription.trim() || form.budgetPlanAmount === "") {
      showError("Required fields are incomplete");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/budget/capex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          year: form.year,
          itemCode: form.itemCode,
          itemDescription: form.itemDescription,
          noCapex: form.noCapex || null,
          itemRemark: form.itemRemark || null,
          budgetPlanAmount: Number(form.budgetPlanAmount),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to save data");
      showSuccess(mode === "edit" ? "Budget Plan CAPEX updated successfully" : "Budget Plan CAPEX created successfully");
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
          {initialData?.budgetDisplayId && (
            <div>
              <label className={labelClass}>Budget ID</label>
              <input disabled value={initialData.budgetDisplayId} className={disabledClass} />
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
              <label className={labelClass}>Item Code <span className="text-red-400">*</span></label>
              <input
                value={form.itemCode}
                onChange={(e) => setForm({ ...form, itemCode: e.target.value })}
                className={inputClass}
                placeholder="e.g. A-T240750040"
                required
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Item Description <span className="text-red-400">*</span></label>
            <input
              value={form.itemDescription}
              onChange={(e) => setForm({ ...form, itemDescription: e.target.value })}
              className={inputClass}
              placeholder="e.g. Oracle License 2 Core"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>No CAPEX</label>
              <input
                value={form.noCapex}
                onChange={(e) => setForm({ ...form, noCapex: e.target.value })}
                className={inputClass}
                placeholder="e.g. KSF/CAPEX/NP/..."
              />
            </div>
            <div>
              <label className={labelClass}>Item Remark</label>
              <input
                value={form.itemRemark}
                onChange={(e) => setForm({ ...form, itemRemark: e.target.value })}
                className={inputClass}
                placeholder="e.g. Oracle License 2 Core (Main server)"
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