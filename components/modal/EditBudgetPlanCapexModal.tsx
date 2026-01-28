"use client";

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

export default function EditBudgetPlanCapexModal({
  open,
  data,
  onClose,
  onSuccess,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* HEADER — SAMA PERSIS DENGAN OPEX */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
          <h2 className="text-lg font-semibold">
            Edit Budget Plan CAPEX
          </h2>
          <p className="text-sm text-slate-200 mt-1">
            Perbarui data budget plan CAPEX
          </p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 bg-white">
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
              budgetRemainingAmount: Number(data.budgetRemainingAmount),
            }}
            onCancel={onClose}
            onSuccess={() => {
              onClose();
              onSuccess();
            }}
          />
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 bg-slate-50 border-t text-sm text-gray-600">
          Pastikan perubahan sesuai dokumen persetujuan CAPEX.
        </div>
      </div>
    </div>
  );
}
