"use client";

import { X, CalendarDays, Hash, Layers } from "lucide-react";
import BudgetPlanForm from "@/components/forms/BudgetPlanForm";
import type { BudgetPlanOpex } from "@prisma/client";

type Props = {
  open: boolean;
  data: BudgetPlanOpex;
  onClose: () => void;
  onSuccess: () => void;
};

function fmt(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function EditBudgetPlanModal({ open, data, onClose, onSuccess }: Props) {
  if (!open) return null;

  const remaining = Number(data.budgetRemainingAmount);

  const formData = {
    id: data.id,
    displayId: data.displayId,
    year: data.year,
    coa: data.coa,
    category: data.category,
    component: data.component,
    budgetPlanAmount: Number(data.budgetPlanAmount),
    budgetRealisasiAmount: Number(data.budgetRealisasiAmount),
    budgetRemainingAmount: remaining,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Edit Budget Plan OPEX</h2>
            <p className="text-xs text-indigo-200 mt-0.5">Modify existing OPEX budget plan</p>
          </div>
          <button type="button" onClick={onClose} className="text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Info strip ── */}
        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-3 flex items-center gap-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-indigo-400 font-medium">Budget ID</span>
            <span className="text-xs font-bold text-indigo-700 font-mono">{data.displayId}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-indigo-400 font-medium">Year</span>
            <span className="text-xs font-bold text-indigo-700">{data.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-indigo-400 font-medium">COA</span>
            <span className="text-xs font-bold text-indigo-700 font-mono">{data.coa}</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs text-indigo-400 font-medium">Remaining</span>
            <span className={`text-xs font-bold ${remaining < 0 ? "text-red-600" : "text-emerald-600"}`}>
              {fmt(remaining)}
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <BudgetPlanForm
            mode="edit"
            initialData={formData}
            onCancel={onClose}
            onSuccess={() => { onSuccess(); onClose(); }}
          />
        </div>
      </div>
    </div>
  );
}