"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import TransactionCapexForm, {
  TransactionCapexFormData,
} from "@/components/forms/TransactionCapexForm";
import { showError, showSuccess } from "@/lib/swal";

type BudgetInfo = {
  displayId: string;
  noCapex: string;
  description: string;
  budgetPlanAmount: number;
  budgetRemainingAmount: number;
};

type Props = {
  open: boolean;
  budgetPlanCapexId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function InputTransactionCapexModal({
  open,
  budgetPlanCapexId,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfo | null>(null);

  useEffect(() => {
    if (open && budgetPlanCapexId) fetchBudgetInfo();
  }, [open, budgetPlanCapexId]);

  const fetchBudgetInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/budget/capex/${budgetPlanCapexId}`);
      if (!res.ok) throw new Error("Failed to fetch budget info");
      const data = await res.json();
      setBudgetInfo({
        displayId: data.budgetDisplayId,
        noCapex: data.noCapex || "-",
        description: data.itemDescription || "-",
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

  const handleSubmit = async (data: TransactionCapexFormData) => {
    try {
      const res = await fetch("/api/transaction/capex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, budgetPlanCapexId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save transaction");
      showSuccess("CAPEX transaction saved successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      showError(error.message || "An error occurred");
    }
  };

  if (!open) return null;

  const fmt = (n: number) => `Rp ${Math.abs(n).toLocaleString("id-ID")}`;

  const initialData: TransactionCapexFormData = {
    vendor: "",
    requester: "",
    projectCode: "",
    noUi: "",
    prNumber: "",
    poType: "",
    poNumber: "",
    documentGR: "",
    description: "",
    assetNumber: "",
    qty: 1,
    amount: "",
    submissionDate: "",
    approvedDate: "",
    deliveryStatus: "",
    ccLob: "",
    status: "",
    notes: "",
    opexCapex: "CAPEX",
    oc: "CAPEX",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Input CAPEX Transaction</h2>
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
                      <p className="text-xs text-indigo-400 font-medium">No CAPEX</p>
                      <p className="text-sm font-bold font-mono text-gray-800">{budgetInfo.noCapex}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-400 font-medium">Description</p>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{budgetInfo.description}</p>
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
                <TransactionCapexForm
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