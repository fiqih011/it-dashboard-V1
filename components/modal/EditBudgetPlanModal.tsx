"use client";

import BudgetPlanForm from "@/components/forms/BudgetPlanForm";
import type { BudgetPlanOpex } from "@prisma/client";

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

  // 🔑 ADAPTER: Prisma bigint → Form number
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded shadow-lg">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold">Edit Budget Plan OPEX</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-4">
          <BudgetPlanForm
            mode="edit"
            initialData={formData}
            onCancel={onClose} // ✅ Cancel langsung nutup modal
            onSuccess={() => {
              onSuccess();
              onClose();       // ✅ Save → close
            }}
          />
        </div>
      </div>
    </div>
  );
}
