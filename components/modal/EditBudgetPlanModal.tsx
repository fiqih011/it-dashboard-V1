"use client";

import BudgetPlanForm from "@/components/forms/BudgetPlanForm";
import type { BudgetPlanOpex } from "@prisma/client";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  data: BudgetPlanOpex;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditBudgetPlanModal({
  open,
  data,
  onClose,
  onSuccess,
}: Props) {
  if (!open) return null;

  // 🔑 ADAPTER: Prisma bigint → Form number (TIDAK DIUBAH)
  const formData = {
    id: data.id,
    displayId: data.displayId,
    year: data.year,
    coa: data.coa,
    category: data.category,
    component: data.component,

    budgetPlanAmount: Number(data.budgetPlanAmount),
    budgetRealisasiAmount: Number(data.budgetRealisasiAmount),
    budgetRemainingAmount: Number(data.budgetRemainingAmount),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
        {/* =====================================================
            HEADER — DISERAGAMKAN (STYLE ONLY)
        ===================================================== */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-5 rounded-t-2xl border-b border-slate-600">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Edit Budget Plan OPEX
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =====================================================
            BODY — TIDAK DIUBAH
        ===================================================== */}
        <div className="p-6">
          <BudgetPlanForm
            mode="edit"
            initialData={formData}
            onCancel={onClose} // ✅ Cancel → close modal
            onSuccess={() => {
              onSuccess();
              onClose();       // ✅ Save → close modal
            }}
          />
        </div>
      </div>
    </div>
  );
}
