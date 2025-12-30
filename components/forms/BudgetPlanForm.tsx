"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type Props = {
  mode: "edit";
  initialData: {
    id: string;
    displayId: string;
    year: number;
    coa: string;
    category: string;
    component: string;
    budgetPlanAmount: string | number;
    budgetRealisasiAmount: string | number;
    budgetRemainingAmount: string | number;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

export default function BudgetPlanForm({
  initialData,
  onSuccess,
  onCancel,
}: Props) {
  const { showToast } = useToast();

  const [coa, setCoa] = useState(initialData.coa);
  const [category, setCategory] = useState(initialData.category);
  const [component, setComponent] = useState(initialData.component);
  const [budgetPlanAmount, setBudgetPlanAmount] = useState(
    String(initialData.budgetPlanAmount)
  );

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (
      !coa ||
      !category ||
      !component ||
      budgetPlanAmount === "" ||
      budgetPlanAmount === null ||
      budgetPlanAmount === undefined
    ) {
      showToast("error", "Field wajib belum lengkap");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/budget/opex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialData.id,
          year: initialData.year,
          coa,
          category,
          component,
          budgetPlanAmount: Number(budgetPlanAmount), // ✅ 0 boleh
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal update data");
      }

      showToast("success", "Budget Plan OPEX berhasil diperbarui");
      onSuccess();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* ID */}
      <div>
        <label className="text-sm text-gray-600">ID</label>
        <input
          disabled
          value={initialData.displayId}
          className="w-full mt-1 px-3 py-2 border rounded bg-gray-100"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Budget Realisasi</label>
          <input
            disabled
            value={Number(
              initialData.budgetRealisasiAmount
            ).toLocaleString()}
            className="w-full mt-1 px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="text-sm">Budget Remaining</label>
          <input
            disabled
            value={Number(
              initialData.budgetRemainingAmount
            ).toLocaleString()}
            className="w-full mt-1 px-3 py-2 border rounded bg-gray-100"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}   // ✅ FIX
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
