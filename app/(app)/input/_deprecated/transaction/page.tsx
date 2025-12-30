"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function InputTransactionPage() {
  const params = useSearchParams();
  const router = useRouter();

  const type = params.get("type"); // opex | capex
  const budgetPlanId = params.get("id");
  const displayId = params.get("displayId");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    vendor: "",
    requester: "",
    description: "",
    qty: 1,
    amount: "",
    status: "DRAFT",
  });

  if (!type || !budgetPlanId) {
    return (
      <div className="p-6 text-sm text-red-600">
        Parameter tidak valid
      </div>
    );
  }

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    const payload =
      type === "opex"
        ? { budgetPlanOpexId: budgetPlanId, ...form }
        : { budgetPlanCapexId: budgetPlanId, ...form };

    try {
      const res = await fetch(`/api/transaction/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan transaksi");
      }

      router.push("/table/transactions");
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-bold">
        Input Transaksi {type.toUpperCase()}
      </h1>

      <div className="text-sm text-gray-600">
        Budget Plan ID: <b>{displayId}</b>
      </div>

      <Input
        label="Vendor"
        value={form.vendor}
        onChange={(v) => handleChange("vendor", v)}
        required
      />

      <Input
        label="Requester"
        value={form.requester}
        onChange={(v) => handleChange("requester", v)}
        required
      />

      <Input
        label="Description"
        value={form.description}
        onChange={(v) => handleChange("description", v)}
        required
      />

      <Input
        label="Qty"
        type="number"
        value={form.qty}
        onChange={(v) => handleChange("qty", Number(v))}
        required
      />

      <Input
        label="Amount"
        type="number"
        value={form.amount}
        onChange={(v) => handleChange("amount", v)}
        required
      />

      <Select
        label="Status"
        value={form.status}
        options={["DRAFT", "APPROVED", "PAID"]}
        onChange={(v) => handleChange("status", v)}
      />

      <div className="flex gap-2 pt-4">
        <Button
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          loading={loading}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
