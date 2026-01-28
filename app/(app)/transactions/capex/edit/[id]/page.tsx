"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import TransactionCapexForm, {
  TransactionCapexFormData,
} from "@/components/forms/TransactionCapexForm";
import { showError, showSuccess } from "@/lib/swal";

export default function EditTransactionCapexPage() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params?.id === "string" ? params.id : undefined;

  const [data, setData] = useState<TransactionCapexFormData | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * =========================================================
   * LOAD DATA — GET /api/transaction/capex/[id]
   * =========================================================
   */
  useEffect(() => {
    if (!id) {
      showError("ID transaksi tidak valid");
      router.push("/transactions/capex");
      return;
    }

    async function load() {
      try {
        const res = await fetch(`/api/transaction/capex/${id}`);

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(
            err?.error ?? "Gagal mengambil data transaksi"
          );
        }

        const trx = await res.json();

        setData({
          transactionId: trx.transactionDisplayId,
          budgetPlanCapexId: trx.budgetPlanCapexId, // UUID for API

          vendor: trx.vendor ?? "",
          requester: trx.requester ?? "",

          projectCode: trx.projectCode ?? "",
          noUi: trx.noUi ?? "",
          prNumber: trx.prNumber ?? "",

          poType: trx.poType ?? "",
          poNumber: trx.poNumber ?? "",
          documentGR: trx.documentGr ?? "",

          description: trx.description ?? "",
          assetNumber: trx.assetNumber ?? "",

          qty: trx.qty ?? 1,
          amount: String(trx.amount ?? ""),

          submissionDate: trx.submissionDate
            ? trx.submissionDate.slice(0, 10)
            : "",
          approvedDate: trx.approvedDate
            ? trx.approvedDate.slice(0, 10)
            : "",

          deliveryStatus: trx.deliveryStatus ?? "",

          opexCapex: "CAPEX",
          ccLob: trx.ccLob ?? "",

          status: trx.status ?? "",
          notes: trx.notes ?? "",
        });
      } catch (err) {
        await showError(
          err instanceof Error ? err.message : "Unknown error"
        );
        router.push("/transactions/capex");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, router]);

  /**
   * =========================================================
   * SUBMIT — PUT /api/transaction/capex/[id]
   * =========================================================
   */
  async function handleSubmit(form: TransactionCapexFormData) {
    if (!id) {
      showError("ID transaksi tidak valid");
      return;
    }

    try {
      const res = await fetch(`/api/transaction/capex/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Gagal memperbarui transaksi");
      }

      await showSuccess("Transaksi CAPEX berhasil diperbarui");
      router.push("/transactions/capex");
    } catch (err) {
      await showError(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }

  /**
   * =========================================================
   * RENDER
   * =========================================================
   */
  if (loading || !data) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-5 border-b border-slate-600">
            <h1 className="text-xl font-bold text-white">
              Edit Transaksi CAPEX
            </h1>
            <p className="text-sm text-slate-200 mt-1">
              Perbarui data transaksi CAPEX
            </p>
          </div>

          {/* CONTEXT BAR */}
          <div className="bg-slate-50 border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Transaction ID</span>
                <p className="font-semibold text-gray-900 font-mono">
                  {data.transactionId}
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="p-6">
            <TransactionCapexForm
              initialData={data}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/transactions/capex")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}