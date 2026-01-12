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

  // budgetPlanId (UUID) DIKIRIM dari tabel budget plan
  const budgetPlanId = searchParams.get("budgetId") ?? "";

  const [loading, setLoading] = useState(true);
  const [displayId, setDisplayId] = useState("");
  const [budgetInfo, setBudgetInfo] = useState<{
    displayId: string;
    coa: string;
    category: string;
    component: string;
    budgetPlanAmount: string;
    budgetRemainingAmount: string;
  } | null>(null);

  /**
   * =========================================
   * FETCH BUDGET PLAN UNTUK DAPATKAN DISPLAY ID
   * =========================================
   */
  useEffect(() => {
    if (!budgetPlanId) {
      showError("Budget ID tidak ditemukan. Silakan akses form dari tabel.");
      router.push("/budget-plan/opex");
      return;
    }

    setLoading(true);
    fetch(`/api/budget/opex/${budgetPlanId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch budget");
        return res.json();
      })
      .then((data) => {
        setDisplayId(data.displayId);
        setBudgetInfo({
          displayId: data.displayId,
          coa: data.coa,
          category: data.category,
          component: data.component,
          budgetPlanAmount: Number(data.budgetPlanAmount).toLocaleString("id-ID"),
          budgetRemainingAmount: Number(data.budgetRemainingAmount).toLocaleString("id-ID"),
        });
      })
      .catch((err) => {
        console.error("Error fetching budget:", err);
        showError("Gagal mengambil data Budget ID");
        router.push("/budget-plan/opex");
      })
      .finally(() => setLoading(false));
  }, [budgetPlanId, router]);

  /**
   * =========================================
   * INITIAL DATA (CREATE MODE)
   * =========================================
   */
  const initialData: TransactionFormData = {
    transactionId: undefined,
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

    opexCapex: "OPEX",  // Default OPEX
    cc: "",
    coa: budgetInfo?.coa || "",  // ✅ Auto-fill COA dari budget
    oc: "",
    status: "",
    notes: "",
  };

  async function handleSubmit(data: TransactionFormData) {
    try {
      const res = await fetch("/api/transaction/opex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budgetId: displayId,
          vendor: data.vendor,
          requester: data.requester,
          prNumber: data.prNumber,
          poType: data.poType,
          poNumber: data.poNumber,
          documentGR: data.documentGR,
          description: data.description,
          qty: data.qty,
          amount: data.amount,
          submissionDate: data.submissionDate,
          approvedDate: data.approvedDate,
          deliveryDate: data.deliveryDate,
          oc: data.oc,
          cc: data.cc,
          coa: data.coa,
          status: data.status,
          notes: data.notes,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal menyimpan transaksi");
      }

      showSuccess("Transaksi berhasil disimpan");
      router.push("/transactions/opex");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Memuat Data Budget
              </h3>
              <p className="text-sm text-gray-600">
                Mohon tunggu sebentar...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Budget ID tidak ditemukan
  if (!displayId || !budgetInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Budget Tidak Ditemukan
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Budget ID tidak ditemukan. Silakan akses form ini melalui tombol
                Input pada tabel Budget Plan.
              </p>
              <button
                onClick={() => router.push("/budget-plan/opex")}
                className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Kembali ke Tabel Budget
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Input Transaksi OPEX
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Lengkapi form di bawah untuk menambahkan transaksi baru
              </p>
            </div>
          </div>

          {/* Budget Info Card */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span className="text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Budget ID
                </span>
              </div>
              <p className="text-lg font-bold text-blue-900 font-mono">
                {budgetInfo.displayId}
              </p>
              <div className="mt-2 text-xs text-blue-700">
                <div>COA: {budgetInfo.coa}</div>
                <div className="truncate" title={budgetInfo.component}>
                  {budgetInfo.component}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs font-medium text-green-700 uppercase tracking-wider">
                  Budget Plan
                </span>
              </div>
              <p className="text-lg font-bold text-green-900">
                Rp {budgetInfo.budgetPlanAmount}
              </p>
              <p className="text-xs text-green-700 mt-1">
                Total anggaran yang direncanakan
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs font-medium text-orange-700 uppercase tracking-wider">
                  Sisa Budget
                </span>
              </div>
              <p className="text-lg font-bold text-orange-900">
                Rp {budgetInfo.budgetRemainingAmount}
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Anggaran yang tersisa
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Form Input Transaksi
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Isi semua informasi yang diperlukan dengan lengkap dan akurat
            </p>
          </div>

          <TransactionForm
            initialData={initialData}
            remainingBudget={budgetInfo.budgetRemainingAmount}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/budget-plan/opex")}
          />
        </div>
      </div>
    </div>
  );
}