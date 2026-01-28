"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import TransactionCapexForm, {
  TransactionCapexFormData,
} from "@/components/forms/TransactionCapexForm";
import { showError, showSuccess } from "@/lib/swal";

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
  const [budget, setBudget] = useState<{ displayId: string; remaining: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch(`/api/budget/capex/${budgetPlanCapexId}`)
      .then((r) => r.json())
      .then((d) =>
        setBudget({
          displayId: d.budgetDisplayId,
          remaining: Number(d.budgetRemainingAmount),
        })
      )
      .catch(() => {
        showError("Gagal memuat budget");
        onClose();
      });
  }, [open, budgetPlanCapexId, onClose]);

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

  async function handleSubmit(data: TransactionCapexFormData) {
    try {
      const res = await fetch("/api/transaction/capex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, budgetPlanCapexId }),
      });

      if (!res.ok) throw new Error("Gagal simpan transaksi");

      showSuccess("Transaksi CAPEX berhasil disimpan");
      onSuccess();
      onClose();
    } catch (e: any) {
      showError(e.message);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
      <div className="bg-white rounded-xl w-full max-w-5xl">
        <div className="bg-slate-800 p-4 flex justify-between text-white">
          <div>
            <h2 className="font-bold">Input Transaksi CAPEX</h2>
            {budget && (
              <div className="text-xs">
                Budget {budget.displayId} | Remaining Rp{" "}
                {budget.remaining.toLocaleString("id-ID")}
              </div>
            )}
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6">
          <TransactionCapexForm
            initialData={initialData}
            remainingBudget={String(budget?.remaining ?? 0)}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
