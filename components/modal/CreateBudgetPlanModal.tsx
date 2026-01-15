"use client";

import BudgetPlanForm from "@/components/forms/BudgetPlanForm";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateBudgetPlanModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* HEADER — SERAGAM DENGAN DETAIL TRANSAKSI */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
          <h2 className="text-lg font-semibold">
            Create Budget Plan OPEX
          </h2>
          <p className="text-sm text-slate-200 mt-1">
            Tambahkan budget plan OPEX tahunan sesuai COA, Category, dan Component
          </p>

          {/* CLOSE BUTTON */}
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
          <BudgetPlanForm
            mode="create"
            onCancel={onClose}
            onSuccess={() => {
              onClose();
              onSuccess();
            }}
          />
        </div>

        {/* FOOTER NOTE — SEPERTI DETAIL */}
        <div className="px-6 py-3 bg-slate-50 border-t text-sm text-gray-600">
          Pastikan data COA, Category, dan Component sudah sesuai standar.
        </div>
      </div>
    </div>
  );
}
