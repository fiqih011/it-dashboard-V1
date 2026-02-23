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
        
        if (!budgetUuid) {
          throw new Error("Budget Plan ID not found in transaction data");
        }

        const budgetRes = await fetch(`/api/budget/opex/${budgetUuid}`);
        if (!budgetRes.ok) throw new Error("Failed to load budget data");

        const budgetData = await budgetRes.json();

        setBudgetInfo({
          displayId: budgetData.displayId,
          coa: budgetData.coa,
          component: budgetData.component || "-",
          remaining: Number(budgetData.budgetRemainingAmount || 0),
        });

        const mapped: TransactionFormData = {
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
          
          submissionDate: txData.submissionDate
            ? new Date(txData.submissionDate).toISOString().split("T")[0]
            : "",
          approvedDate: txData.approvedDate
            ? new Date(txData.approvedDate).toISOString().split("T")[0]
            : "",
          deliveryDate: txData.deliveryDate
            ? new Date(txData.deliveryDate).toISOString().split("T")[0]
            : "",
          
          opexCapex: txData.opexCapex || "OPEX",
          cc: txData.ccLob || "",
          coa: budgetData.coa || "",
          oc: txData.oc || "",
          status: txData.status || "",
          notes: txData.notes || "",
        };

        setFormData(mapped);
      } catch (err) {
        console.error("Load error:", err);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-gray-200">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-5 rounded-t-2xl border-b border-slate-600">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">
                Edit OPEX Transaction
              </h2>
              <p className="text-sm text-slate-200 mt-1">
                Update operational expenditure transaction data
              </p>

              {budgetInfo && formData && (
                <div className="mt-4 bg-slate-600/30 rounded-lg px-4 py-3 border border-slate-500/50">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-medium">Budget OPEX:</span>
                      <span className="font-bold font-mono text-white">
                        {budgetInfo.displayId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-medium">COA:</span>
                      <span className="font-bold font-mono text-white">
                        {budgetInfo.coa}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <span className="text-slate-300 font-medium">Component:</span>
                      <span className="font-semibold text-white">
                        {budgetInfo.component}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 pt-1 border-t border-slate-500/50">
                      <span className="text-slate-300 font-medium">Remaining Budget:</span>
                      <span className="font-bold text-green-300 text-base">
                        Rp {budgetInfo.remaining.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors ml-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading || !formData ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-slate-600 mb-4"></div>
                <p className="text-slate-500 text-sm font-medium">Loading transaction data...</p>
              </div>
            </div>
          ) : (
            <TransactionForm
              initialData={formData}
              remainingBudget={budgetInfo?.remaining.toLocaleString("id-ID")}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}