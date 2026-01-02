"use client";

import { useRouter, useSearchParams } from "next/navigation";
import TransactionForm, {
  TransactionFormData,
} from "@/components/forms/TransactionForm";
import { showError, showSuccess } from "@/lib/swal";

export default function InputTransactionOpexPage() {
  const router = useRouter();
  const params = useSearchParams();

  const budgetPlanOpexId = params.get("id");
  const coa = params.get("coa") ?? "";

  async function handleSubmit(data: TransactionFormData) {
    const res = await fetch("/api/transaction/opex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        budgetPlanOpexId,
        coa,
        ...data,
        qty: Number(data.qty),
        amount: Number(data.amount),
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      await showError(err.error ?? "Gagal menyimpan transaksi");
      return;
    }

    await showSuccess("Transaksi berhasil disimpan");
    router.push("/budget-plan/opex");
  }

  return (
    <TransactionForm
      onSubmit={handleSubmit}
      onCancel={() => router.push("/budget-plan/opex")}
    />
  );
}
