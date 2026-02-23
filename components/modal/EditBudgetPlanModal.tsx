"use client";

import { X } from "lucide-react";
import BudgetPlanForm from "@/components/forms/BudgetPlanForm";
import type { BudgetPlanOpex } from "@prisma/client";

type Props = {
  open: boolean;
  data: BudgetPlanOpex;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditBudgetPlanModal({ open, data, onClose, onSuccess }: Props) {
  if (!open) return null;

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
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Edit Budget Plan OPEX</h2>
              <p className="text-sm text-indigo-200 mt-0.5">{data.displayId}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6">
          <BudgetPlanForm
            mode="edit"
            initialData={formData}
            onCancel={onClose}
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}