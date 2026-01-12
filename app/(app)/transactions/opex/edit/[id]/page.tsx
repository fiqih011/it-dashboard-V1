"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import TransactionForm, {
  TransactionFormData,
} from "@/components/forms/TransactionForm";
import { showError, showSuccess } from "@/lib/swal";

export default function EditTransactionOpexPage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params?.id === "string" ? params.id : undefined;

  const [data, setData] =
    useState<TransactionFormData | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * =========================================================
   * LOAD DATA — GET /api/transaction/opex/[id]
   * =========================================================
   */
  useEffect(() => {
    if (!id) {
      showError("ID transaksi tidak valid");
      router.push("/transactions/opex");
      return;
    }

    async function load() {
      try {
        const res = await fetch(
          `/api/transaction/opex/${id}`
        );

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(
            err?.error ?? "Gagal mengambil data transaksi"
          );
        }

        const trx = await res.json();

        setData({
          transactionId: trx.displayId,
          budgetId: trx.budgetPlanDisplayId,

          // 🔴 WAJIB ADA (INI YANG HILANG)
          opexCapex: "OPEX",
          coa: trx.coa ?? "",

          vendor: trx.vendor ?? "",
          requester: trx.requester ?? "",
          prNumber: trx.prNumber ?? "",
          poType: trx.poType ?? "",
          poNumber: trx.poNumber ?? "",
          documentGR: trx.documentGr ?? "",
          description: trx.description ?? "",
          qty: trx.qty ?? 1,
          amount: String(trx.amount ?? ""),

          submissionDate: trx.submissionDate
            ? trx.submissionDate.slice(0, 10)
            : "",
          approvedDate: trx.approvedDate
            ? trx.approvedDate.slice(0, 10)
            : "",
          deliveryDate: trx.deliveryDate
            ? trx.deliveryDate.slice(0, 10)
            : "",

          oc: trx.oc ?? "",
          cc: trx.ccLob ?? "",
          status: trx.status ?? "",
          notes: trx.notes ?? "",
        });
      } catch (err) {
        await showError(
          err instanceof Error ? err.message : "Unknown error"
        );
        router.push("/transactions/opex");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, router]);

  /**
   * =========================================================
   * SUBMIT — PUT /api/transaction/opex/[id]
   * =========================================================
   */
  async function handleSubmit(
    form: TransactionFormData
  ) {
    if (!id) {
      showError("ID transaksi tidak valid");
      return;
    }

    try {
      const res = await fetch(
        `/api/transaction/opex/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          err?.error ?? "Gagal memperbarui transaksi"
        );
      }

      await showSuccess("Transaksi berhasil diperbarui");
      router.push("/transactions/opex");
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
    <TransactionForm
      initialData={data}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/transactions/opex")}
    />
  );
}
