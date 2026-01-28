"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TransactionCapexForm, {
  TransactionCapexFormData,
} from "@/components/forms/TransactionCapexForm";
import { showError, showSuccess } from "@/lib/swal";

export default function InputTransactionCapexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const budgetPlanId = searchParams.get("budgetId") ?? "";

  const [loading, setLoading] = useState(true);
  const [budgetInfo, setBudgetInfo] = useState<{
    budgetDisplayId: string;
    itemCode: string;
    itemDescription: string;
    budgetPlanAmount: string;
    budgetRemainingAmount: string;
  } | null>(null);

  useEffect(() => {
    if (!budgetPlanId) {
      showError("Budget ID tidak ditemukan.");
      router.push("/budget-plan/capex");
      return;
    }

    fetch(`/api/budget/capex/${budgetPlanId}`)
      .then((res) => res.json())
      .then((data) => {
        setBudgetInfo({
          budgetDisplayId: data.budgetDisplayId,
          itemCode: data.itemCode,
          itemDescription: data.itemDescription,
          budgetPlanAmount: Number(data.budgetPlanAmount).toLocaleString("id-ID"),
          budgetRemainingAmount: Number(
            data.budgetRemainingAmount
          ).toLocaleString("id-ID"),
        });
      })
      .catch(() => {
        showError("Gagal mengambil data budget");
        router.push("/budget-plan/capex");
      })
      .finally(() => setLoading(false));
  }, [budgetPlanId, router]);

  if (loading || !budgetInfo) return null;

  const initialData: TransactionCapexFormData = {
    budgetPlanCapexId: budgetPlanId, // UUID for API
    
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
    
    opexCapex: "CAPEX",
    ccLob: "",
    
    status: "",
    notes: "",
  };

  async function handleSubmit(data: TransactionCapexFormData) {
    try {
      const res = await fetch("/api/transaction/capex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budgetPlanCapexId: budgetPlanId, // UUID
          vendor: data.vendor,
          requester: data.requester,
          projectCode: data.projectCode || null,
          noUi: data.noUi || null,
          prNumber: data.prNumber || null,
          poType: data.poType || null,
          poNumber: data.poNumber || null,
          documentGr: data.documentGR || null,
          description: data.description,
          assetNumber: data.assetNumber || null,
          qty: Number(data.qty),
          amount: data.amount,
          submissionDate: data.submissionDate || null,
          approvedDate: data.approvedDate || null,
          deliveryDate: null, // CAPEX pakai deliveryStatus, bukan deliveryDate
          oc: data.opexCapex || null,
          ccLob: data.ccLob || null,
          status: data.status,
          notes: data.notes || null,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error);

      showSuccess("Transaksi CAPEX berhasil disimpan");
      router.push("/transactions/capex");
    } catch (err: any) {
      showError(err.message ?? "Terjadi kesalahan");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
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
              Input Transaksi CAPEX
            </h1>
            <p className="text-sm text-slate-200 mt-1">
              Lengkapi form di bawah untuk menambahkan transaksi CAPEX baru
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
                  {budgetInfo.budgetDisplayId}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Item Code</span>
                <p className="font-semibold text-gray-900 font-mono">
                  {budgetInfo.itemCode}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Item Description</span>
                <p className="font-semibold text-gray-900 truncate">
                  {budgetInfo.itemDescription}
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
            <TransactionCapexForm
              initialData={initialData}
              remainingBudget={budgetInfo.budgetRemainingAmount}
              onSubmit={handleSubmit}
              onCancel={() => router.back()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}