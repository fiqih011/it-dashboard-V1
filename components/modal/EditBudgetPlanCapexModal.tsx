"use client";

import { X, CalendarDays, Tag, Hash } from "lucide-react";
import BudgetPlanCapexForm from "@/components/forms/BudgetPlanCapexForm";

type Props = {
  open: boolean;
  data: {
    id: string;
    budgetDisplayId: string;
    year: number;
    itemCode: string;
    itemDescription: string;
    noCapex: string | null;
    itemRemark: string | null;
    budgetPlanAmount: bigint;
    budgetRealisasiAmount: bigint;
    budgetRemainingAmount: bigint;
  };
  onClose: () => void;
  onSuccess: () => void;
};

function fmt(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function EditBudgetPlanCapexModal({ open, data, onClose, onSuccess }: Props) {
  if (!open) return null;

  const remaining = Number(data.budgetRemainingAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Edit Budget Plan CAPEX</h2>
            <p className="text-xs text-indigo-200 mt-0.5">Modify existing CAPEX budget plan</p>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Info strip ── */}
        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-3 flex items-center gap-6 flex-wrap flex-shrink-0">
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-indigo-400 font-medium">Budget ID</span>
            <span className="text-xs font-bold text-indigo-700 font-mono">{data.budgetDisplayId}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-indigo-400 font-medium">Year</span>
            <span className="text-xs font-bold text-indigo-700">{data.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-indigo-400 font-medium">Item Code</span>
            <span className="text-xs font-bold text-indigo-700 font-mono">{data.itemCode}</span>
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
          <BudgetPlanCapexForm
            mode="edit"
            initialData={{
              id: data.id,
              budgetDisplayId: data.budgetDisplayId,
              year: data.year,
              itemCode: data.itemCode,
              itemDescription: data.itemDescription,
              noCapex: data.noCapex,
              itemRemark: data.itemRemark,
              budgetPlanAmount: Number(data.budgetPlanAmount),
              budgetRealisasiAmount: Number(data.budgetRealisasiAmount),
              budgetRemainingAmount: remaining,
            }}
            onCancel={onClose}
            onSuccess={() => { onClose(); onSuccess(); }}
          />
        </div>
      </div>
    </div>
  );
}