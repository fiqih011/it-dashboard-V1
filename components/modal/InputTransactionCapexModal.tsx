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
  budgetPlanAmount: string;
  budgetRemainingAmount: string;
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
    if (open && budgetPlanCapexId) {
      fetchBudgetInfo();
    }
  }, [open, budgetPlanCapexId]);

  const fetchBudgetInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/budget/capex/${budgetPlanCapexId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch budget info");
      }

      const data = await response.json();
      setBudgetInfo({
        displayId: data.budgetDisplayId,
        noCapex: data.noCapex || "-",
        description: data.itemDescription || "-",
        budgetPlanAmount: Number(data.budgetPlanAmount).toLocaleString("id-ID"),
        budgetRemainingAmount: Number(data.budgetRemainingAmount).toLocaleString("id-ID"),
      });
    } catch (error) {
      console.error("Error fetching budget info:", error);
      showError("Failed to load budget data");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: TransactionCapexFormData) => {
    try {
      const response = await fetch("/api/transaction/capex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          budgetPlanCapexId,
        }),
      });

      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json?.error || "Failed to save transaction");
      }

      showSuccess("CAPEX transaction saved successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      showError(error.message || "An error occurred");
    }
  };

  if (!open) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-gray-200">
        {/* 
          =====================================================
          HEADER
          =====================================================
        */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 rounded-t-2xl border-b border-slate-600">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">
                Input CAPEX Transaction
              </h2>
              <p className="text-xs text-slate-200 mt-0.5">
                Complete the form below to add a new transaction
              </p>

              {/* Budget Info - Compact */}
              {budgetInfo && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300">Budget CAPEX:</span>
                    <span className="font-semibold font-mono">{budgetInfo.displayId}</span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300">No CAPEX:</span>
                    <span className="font-semibold font-mono">{budgetInfo.noCapex}</span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300">Description:</span>
                    <span className="font-semibold truncate max-w-xs">
                      {budgetInfo.description}
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
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-600 mb-3"></div>
                <p className="text-slate-500 text-sm">Loading budget data...</p>
              </div>
            </div>
          ) : budgetInfo ? (
            <TransactionCapexForm
              initialData={initialData}
              remainingBudget={budgetInfo.budgetRemainingAmount}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          ) : (
            <div className="text-center py-12 text-slate-500">
              Failed to load budget data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}