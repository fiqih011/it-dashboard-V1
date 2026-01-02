"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TransactionForm, {
  TransactionFormData,
} from "@/components/forms/TransactionForm";
import { showError, showSuccess } from "@/lib/swal";

export default function EditTransactionOpexPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<TransactionFormData | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/transaction/opex");
      const json = await res.json();
      const trx = json.data.find((r: any) => r.id === id);

      if (!trx) {
        await showError("Transaksi tidak ditemukan");
        router.push("/transactions/opex");
        return;
      }

      setData(trx);
    }

    load();
  }, [id, router]);

  async function handleSubmit(form: TransactionFormData) {
    const res = await fetch(`/api/transaction/opex?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      await showError(err.error ?? "Gagal update transaksi");
      return;
    }

    await showSuccess("Transaksi berhasil diperbarui");
    router.push("/transactions/opex");
  }

  if (!data) return <div>Loading...</div>;

  return (
    <TransactionForm
      initialData={data}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/transactions/opex")}
    />
  );
}
