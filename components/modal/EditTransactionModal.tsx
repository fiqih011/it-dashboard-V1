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

  /* ===============================
   * LOAD TRANSACTION + BUDGET
   * =============================== */
  useEffect(() => {
    if (!open || !transactionId) return;

    async function loadData() {
      try {
        setLoading(true);

        // 1. FETCH TRANSACTION (by UUID)
        const txRes = await fetch(`/api/transaction/opex/${transactionId}`);
        if (!txRes.ok) throw new Error("Gagal memuat data transaksi");

        const txData = await txRes.json();
        console.log("📥 Transaction data:", txData);

        // 2. FETCH BUDGET (by UUID dari budgetPlanOpexId)
        const budgetUuid = txData.budgetPlanOpexId || txData.budgetPlanId || txData.budgetId;
        
        console.log("🔑 Budget UUID from transaction:", budgetUuid);
        console.log("🔍 Transaction keys:", Object.keys(txData));
        
        if (!budgetUuid) {
          console.error("❌ Available transaction data:", txData);
          throw new Error("Budget Plan ID tidak ditemukan di data transaksi");
        }

        const budgetRes = await fetch(`/api/budget/opex/${budgetUuid}`);
        if (!budgetRes.ok) throw new Error("Gagal memuat data budget");

        const budgetData = await budgetRes.json();
        console.log("📥 Budget data:", budgetData);

        // 3. SET BUDGET INFO
        setBudgetInfo({
          displayId: budgetData.displayId,
          coa: budgetData.coa,
          component: budgetData.component || "-",
          remaining: Number(budgetData.budgetRemainingAmount || 0),
        });

        // 4. MAP TRANSACTION DATA KE FORM
        const mapped: TransactionFormData = {
          transactionId: txData.displayId, // TRX-OP-25-0001
          budgetId: budgetData.displayId,  // ✅ OP-250001 (dari budget)
          
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
          
          opexCapex: txData.opexCapex || "OPEX", // ✅ Dari database
          cc: txData.ccLob || "",
          coa: budgetData.coa || "", // ✅ Dari budget
          oc: txData.oc || "",
          status: txData.status || "",
          notes: txData.notes || "",
        };

        console.log("✅ Mapped form data:", mapped);
        setFormData(mapped);
      } catch (err) {
        console.error("❌ Load error:", err);
        showError(err instanceof Error ? err.message : "Unknown error");
        onClose();
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [open, transactionId, onClose]);

  /* ===============================
   * SUBMIT
   * =============================== */
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
        throw new Error(err.error ?? "Gagal update transaksi");
      }

      showSuccess("Transaksi berhasil diperbarui");
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-gray-200">
        {/* 
          =====================================================
          HEADER
          =====================================================
        */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 rounded-t-2xl border-b border-slate-600">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">
                Edit Transaksi OPEX
              </h2>
              <p className="text-xs text-slate-200 mt-0.5">
                Perbarui data transaksi
              </p>

              {/* Budget Info - Compact */}
              {budgetInfo && formData && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300">Transaction ID:</span>
                    <span className="font-semibold font-mono">
                      {formData.transactionId}
                    </span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300">Budget ID:</span>
                    <span className="font-semibold font-mono">
                      {budgetInfo.displayId}
                    </span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300">COA:</span>
                    <span className="font-semibold font-mono">
                      {budgetInfo.coa}
                    </span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300">Description:</span>
                    <span className="font-semibold truncate max-w-xs">
                      {formData.description || "-"}
                    </span>
                  </div>
                </div>
              )}

              {/* Budget Summary */}
              {budgetInfo && (
                <div className="flex gap-4 mt-2 text-xs text-slate-100">
                  <span>
                    Remaining Budget:{" "}
                    <strong className="text-green-300">
                      Rp {budgetInfo.remaining.toLocaleString("id-ID")}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 
          =====================================================
          BODY - SCROLLABLE FORM
          =====================================================
        */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading || !formData ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-600 mb-3"></div>
                <p className="text-slate-500 text-sm">Memuat data...</p>
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