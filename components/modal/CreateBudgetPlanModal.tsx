"use client";

import { X } from "lucide-react";
import BudgetPlanForm from "@/components/forms/BudgetPlanForm";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateBudgetPlanModal({ open, onClose, onSuccess }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* HEADER */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Create Budget Plan OPEX</h2>
              <p className="text-sm text-indigo-200 mt-0.5">
                Tambahkan budget plan OPEX tahunan sesuai COA, Category, dan Component
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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

        {/* FOOTER */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
          Pastikan data COA, Category, dan Component sudah sesuai standar.
        </div>
      </div>
    </div>
  );
}