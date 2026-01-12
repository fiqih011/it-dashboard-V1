"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { showSuccess, showError } from "@/lib/swal";

export default function InputBudgetPlanOpexPage() {
  const router = useRouter();

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [coa, setCoa] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [component, setComponent] = useState<string>("");
  const [budgetPlanAmount, setBudgetPlanAmount] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit() {
    if (
      !year ||
      !coa.trim() ||
      !category.trim() ||
      !component.trim() ||
      budgetPlanAmount === ""
    ) {
      showError("Semua field wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/budget/opex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year,
          coa,
          category,
          component,
          budgetPlanAmount: Number(budgetPlanAmount), // 0 boleh
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal menyimpan budget plan");
      }

      showSuccess("Budget Plan OPEX berhasil disimpan");
      router.push("/budget-plan/opex");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-lg font-semibold">
        Input Budget Plan OPEX
      </h1>

      <div>
        <label className="text-sm">Tahun</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full mt-1 px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="text-sm">COA</label>
        <input
          value={coa}
          onChange={(e) => setCoa(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="text-sm">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="text-sm">Component</label>
        <input
          value={component}
          onChange={(e) => setComponent(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="text-sm">Budget Plan</label>
        <input
          type="number"
          value={budgetPlanAmount}
          onChange={(e) => setBudgetPlanAmount(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </div>
  );
}
