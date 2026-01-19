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
  budgetPlanAmount: string;
  budgetRemainingAmount: string;
};

type Props = {
  open: boolean;
  budgetPlanId: string;
  onClose: () => void;
  onSuccess: () => void; // callback setelah berhasil simpan
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
    if (open && budgetPlanId) {
      fetchBudgetInfo();
    }
  }, [open, budgetPlanId]);

  const fetchBudgetInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/budget/opex/${budgetPlanId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch budget info");
      }

      const data = await response.json();
      setBudgetInfo({
        displayId: data.displayId,
        coa: data.coa,
        component: data.component,
        budgetPlanAmount: Number(data.budgetPlanAmount).toLocaleString("id-ID"),
        budgetRemainingAmount: Number(
          data.budgetRemainingAmount
        ).toLocaleString("id-ID"),
      });
    } catch (error) {
      console.error("Error fetching budget info:", error);
      showError("Gagal memuat data budget");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      const response = await fetch("/api/transaction/opex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          budgetId: budgetInfo?.displayId,
        }),
      });

      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json?.error || "Gagal menyimpan transaksi");
      }

      showSuccess("Transaksi berhasil disimpan");
      onSuccess(); // trigger refresh data
      onClose(); // tutup modal
    } catch (error: any) {
      showError(error.message || "Terjadi kesalahan");
    }
  };

  if (!open) return null;

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
                Input Transaksi OPEX
              </h2>
              <p className="text-xs text-slate-200 mt-0.5">
                Lengkapi form di bawah untuk menambahkan transaksi baru
              </p>

              {/* Budget Info - Compact */}
              {budgetInfo && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300">Budget ID:</span>
                    <span className="font-semibold font-mono">{budgetInfo.displayId}</span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300">COA:</span>
                    <span className="font-semibold font-mono">{budgetInfo.coa}</span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300">Component:</span>
                    <span className="font-semibold truncate max-w-xs">
                      {budgetInfo.component}
                    </span>
                  </div>
                </div>
              )}

              {/* Budget Summary */}
              {budgetInfo && (
                <div className="flex gap-4 mt-2 text-xs text-slate-100">
                  <span>
                    Planned: <strong>Rp {budgetInfo.budgetPlanAmount}</strong>
                  </span>
                  <span>|</span>
                  <span>
                    Remaining:{" "}
                    <strong className="text-green-300">
                      Rp {budgetInfo.budgetRemainingAmount}
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-600 mb-3"></div>
                <p className="text-slate-500 text-sm">Memuat data budget...</p>
              </div>
            </div>
          ) : budgetInfo ? (
            <TransactionForm
              initialData={initialData}
              remainingBudget={budgetInfo.budgetRemainingAmount}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          ) : (
            <div className="text-center py-12 text-slate-500">
              Gagal memuat data budget
            </div>
          )}
        </div>
      </div>
    </div>
  );
}