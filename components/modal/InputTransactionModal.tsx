"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import TransactionForm, {
  TransactionFormData,
} from "@/components/forms/TransactionForm";
import { showError, showSuccess } from "@/lib/swal";

type BudgetInfo = {
  displayId: string;
  coa: string;
  component: string;
  budgetPlanAmount: number;
  budgetRemainingAmount: number;
};

type Props = {
  open: boolean;
  budgetPlanId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function InputTransactionModal({
  open,
  budgetPlanId,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfo | null>(null);

  useEffect(() => {
    if (open && budgetPlanId) fetchBudgetInfo();
  }, [open, budgetPlanId]);

  const fetchBudgetInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/budget/opex/${budgetPlanId}`);
      if (!res.ok) throw new Error("Failed to fetch budget info");
      const data = await res.json();
      setBudgetInfo({
        displayId: data.displayId,
        coa: data.coa,
        component: data.component,
        budgetPlanAmount: Number(data.budgetPlanAmount),
        budgetRemainingAmount: Number(data.budgetRemainingAmount),
      });
    } catch (error) {
      showError("Failed to load budget data");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      const res = await fetch("/api/transaction/opex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, budgetId: budgetInfo?.displayId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save transaction");
      showSuccess("Transaction saved successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      showError(error.message || "An error occurred");
    }
  };

  if (!open) return null;

  const fmt = (n: number) => `Rp ${Math.abs(n).toLocaleString("id-ID")}`;

  const initialData: TransactionFormData = {
    budgetId: budgetInfo?.displayId || "",
    vendor: "",
    requester: "",
    prNumber: "",
    poType: "",
    poNumber: "",
    documentGR: "",
    description: "",
    qty: 1,
    amount: "",
    submissionDate: "",
    approvedDate: "",
    deliveryDate: "",
    opexCapex: "OPEX",
    cc: "",
    coa: budgetInfo?.coa || "",
    oc: "",
    status: "",
    notes: "",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Input Transaksi OPEX</h2>
            <p className="text-xs text-indigo-200 mt-0.5">Complete the form below to add a new transaction</p>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body: 2-panel ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT — sticky budget info */}
          <div className="w-52 flex-shrink-0 bg-indigo-50 border-r border-indigo-100 p-5 flex flex-col gap-4 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-300 border-t-indigo-600" />
              </div>
            ) : budgetInfo ? (
              <>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-400 mb-3">Budget Info</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-indigo-400 font-medium">Budget ID</p>
                      <p className="text-sm font-bold font-mono text-gray-800">{budgetInfo.displayId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-400 font-medium">COA</p>
                      <p className="text-sm font-bold font-mono text-gray-800">{budgetInfo.coa}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-400 font-medium">Component</p>
                      <p className="text-sm font-semibold text-gray-800">{budgetInfo.component}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-indigo-200 pt-4">
                  <p className="text-xs text-indigo-400 font-medium mb-1">Total Budget</p>
                  <p className="text-sm font-semibold text-gray-700">{fmt(budgetInfo.budgetPlanAmount)}</p>
                </div>

                <div className="border-t border-indigo-200 pt-4">
                  <p className="text-xs text-indigo-400 font-medium mb-1">Remaining</p>
                  <p className={`text-base font-bold ${budgetInfo.budgetRemainingAmount < 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {budgetInfo.budgetRemainingAmount < 0 ? "-" : ""}{fmt(budgetInfo.budgetRemainingAmount)}
                  </p>
                  {budgetInfo.budgetRemainingAmount < 0 && (
                    <p className="text-xs text-red-500 mt-1 font-medium">⚠ Over budget</p>
                  )}
                </div>
              </>
            ) : null}
          </div>

          {/* RIGHT — scrollable form */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full py-16">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 mb-3" />
                  <p className="text-sm text-gray-500">Loading budget data...</p>
                </div>
              </div>
            ) : budgetInfo ? (
              <div className="p-6">
                <TransactionForm
                  initialData={initialData}
                  remainingBudget={budgetInfo.budgetRemainingAmount.toLocaleString("id-ID")}
                  onSubmit={handleSubmit}
                  onCancel={onClose}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full py-16 text-sm text-gray-400">
                Failed to load budget data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}