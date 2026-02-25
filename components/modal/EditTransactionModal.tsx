"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import TransactionForm, {
  TransactionFormData,
} from "@/components/forms/TransactionForm";
import { showError, showSuccess } from "@/lib/swal";

type Props = {
  open: boolean;
  transactionId: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditTransactionModal({
  open,
  transactionId,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData | null>(null);
  const [budgetInfo, setBudgetInfo] = useState<{
    displayId: string;
    coa: string;
    component: string;
    remaining: number;
    planned: number;
  } | null>(null);

  useEffect(() => {
    if (!open || !transactionId) return;

    async function loadData() {
      try {
        setLoading(true);

        const txRes = await fetch(`/api/transaction/opex/${transactionId}`);
        if (!txRes.ok) throw new Error("Failed to load transaction data");
        const txData = await txRes.json();

        const budgetUuid = txData.budgetPlanOpexId || txData.budgetPlanId || txData.budgetId;
        if (!budgetUuid) throw new Error("Budget Plan ID not found in transaction data");

        const budgetRes = await fetch(`/api/budget/opex/${budgetUuid}`);
        if (!budgetRes.ok) throw new Error("Failed to load budget data");
        const budgetData = await budgetRes.json();

        setBudgetInfo({
          displayId: budgetData.displayId,
          coa: budgetData.coa,
          component: budgetData.component || "-",
          remaining: Number(budgetData.budgetRemainingAmount || 0),
          planned: Number(budgetData.budgetPlanAmount || 0),
        });

        setFormData({
          transactionId: txData.displayId,
          budgetId: budgetData.displayId,
          vendor: txData.vendor || "",
          requester: txData.requester || "",
          prNumber: txData.prNumber || "",
          poType: txData.poType || "",
          poNumber: txData.poNumber || "",
          documentGR: txData.documentGr || "",
          description: txData.description || "",
          qty: txData.qty || 1,
          amount: String(txData.amount || ""),
          submissionDate: txData.submissionDate ? new Date(txData.submissionDate).toISOString().split("T")[0] : "",
          approvedDate: txData.approvedDate ? new Date(txData.approvedDate).toISOString().split("T")[0] : "",
          deliveryDate: txData.deliveryDate ? new Date(txData.deliveryDate).toISOString().split("T")[0] : "",
          opexCapex: txData.opexCapex || "OPEX",
          cc: txData.ccLob || "",
          coa: budgetData.coa || "",
          oc: txData.oc || "",
          status: txData.status || "",
          notes: txData.notes || "",
        });
      } catch (err) {
        showError(err instanceof Error ? err.message : "Unknown error");
        onClose();
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [open, transactionId, onClose]);

  async function handleSubmit(payload: TransactionFormData) {
    if (!transactionId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/transaction/opex/${transactionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update transaction");
      }
      showSuccess("Transaction updated successfully");
      onClose();
      onSuccess();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const fmt = (n: number) =>
    `Rp ${Math.abs(n).toLocaleString("id-ID")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Edit OPEX Transaction</h2>
            <p className="text-xs text-indigo-200 mt-0.5">Update operational expenditure transaction data</p>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body: 2-panel ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT — sticky budget info */}
          <div className="w-52 flex-shrink-0 bg-indigo-50 border-r border-indigo-100 p-5 flex flex-col gap-4 overflow-y-auto">
            {budgetInfo ? (
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
                  <p className="text-sm font-semibold text-gray-700">{fmt(budgetInfo.planned)}</p>
                </div>

                <div className="border-t border-indigo-200 pt-4">
                  <p className="text-xs text-indigo-400 font-medium mb-1">Remaining</p>
                  <p className={`text-base font-bold ${budgetInfo.remaining < 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {budgetInfo.remaining < 0 ? "-" : ""}{fmt(budgetInfo.remaining)}
                  </p>
                  {budgetInfo.remaining < 0 && (
                    <p className="text-xs text-red-500 mt-1 font-medium">⚠ Over budget</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-300 border-t-indigo-600" />
              </div>
            )}
          </div>

          {/* RIGHT — scrollable form */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {loading || !formData ? (
              <div className="flex items-center justify-center h-full py-16">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 mb-3" />
                  <p className="text-sm text-gray-500">Loading transaction data...</p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <TransactionForm
                  initialData={formData}
                  remainingBudget={budgetInfo?.remaining.toLocaleString("id-ID")}
                  onSubmit={handleSubmit}
                  onCancel={onClose}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}