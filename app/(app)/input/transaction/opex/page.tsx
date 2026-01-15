"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TransactionForm, {
  TransactionFormData,
} from "@/components/forms/TransactionForm";
import { showError, showSuccess } from "@/lib/swal";

export default function InputTransactionOpexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const budgetPlanId = searchParams.get("budgetId") ?? "";

  const [loading, setLoading] = useState(true);
  const [displayId, setDisplayId] = useState("");
  const [budgetInfo, setBudgetInfo] = useState<{
    displayId: string;
    coa: string;
    component: string;
    budgetPlanAmount: string;
    budgetRemainingAmount: string;
  } | null>(null);

  useEffect(() => {
    if (!budgetPlanId) {
      showError("Budget ID tidak ditemukan.");
      router.push("/budget-plan/opex");
      return;
    }

    fetch(`/api/budget/opex/${budgetPlanId}`)
      .then((res) => res.json())
      .then((data) => {
        setDisplayId(data.displayId);
        setBudgetInfo({
          displayId: data.displayId,
          coa: data.coa,
          component: data.component,
          budgetPlanAmount: Number(data.budgetPlanAmount).toLocaleString("id-ID"),
          budgetRemainingAmount: Number(
            data.budgetRemainingAmount
          ).toLocaleString("id-ID"),
        });
      })
      .catch(() => {
        showError("Gagal mengambil data budget");
        router.push("/budget-plan/opex");
      })
      .finally(() => setLoading(false));
  }, [budgetPlanId, router]);

  if (loading || !budgetInfo) return null;

  const initialData: TransactionFormData = {
    budgetId: displayId,
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
    coa: budgetInfo.coa,
    oc: "",
    status: "",
    notes: "",
  };

  async function handleSubmit(data: TransactionFormData) {
    try {
      const res = await fetch("/api/transaction/opex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, budgetId: displayId }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error);

      showSuccess("Transaksi berhasil disimpan");
      router.push("/transactions/opex");
    } catch (err: any) {
      showError(err.message ?? "Terjadi kesalahan");
    }
  }

  return (

      <div className="min-h-screen bg-slate-50">
        {/* 
          =====================================================
          WRAPPER CONTAINER - BACKGROUND PUTIH MENYATUKAN SEMUA
          =====================================================
        */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* 
            =====================================================
            PAGE HEADER - GRADIENT THEME (sama seperti modal)
            =====================================================
          */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-5 border-b border-slate-600">
            <h1 className="text-xl font-bold text-white">
              Input Transaksi OPEX
            </h1>
            <p className="text-sm text-slate-200 mt-1">
              Lengkapi form di bawah untuk menambahkan transaksi baru
            </p>
          </div>

          {/* 
            =====================================================
            CONTEXT BAR - BUDGET INFO (netral dengan border)
            =====================================================
          */}
          <div className="bg-slate-50 border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Budget ID</span>
                <p className="font-semibold text-gray-900 font-mono">
                  {budgetInfo.displayId}
                </p>
              </div>
              <div>
                <span className="text-gray-500">COA</span>
                <p className="font-semibold text-gray-900 font-mono">
                  {budgetInfo.coa}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Component</span>
                <p className="font-semibold text-gray-900 truncate">
                  {budgetInfo.component}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Planned Budget</span>
                <p className="font-semibold text-gray-900">
                  Rp {budgetInfo.budgetPlanAmount}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Remaining Budget</span>
                <p className="font-bold text-gray-900">
                  Rp {budgetInfo.budgetRemainingAmount}
                </p>
              </div>
            </div>
          </div>

          {/* 
            =====================================================
            FORM CONTAINER
            =====================================================
          */}
          <div className="p-6">
            <TransactionForm
              initialData={initialData}
              remainingBudget={budgetInfo.budgetRemainingAmount}
              onSubmit={handleSubmit}
              onCancel={() => router.back()}
            />
          </div>
        </div>
      </div>

  );
}