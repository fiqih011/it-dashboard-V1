"use client";

import { useState } from "react";
import { useToast } from "@/lib/swal";

type Props = {
  mode: "edit" | "create";
  initialData?: {
    id?: string;
    displayId?: string;
    year: number;
    coa: string;
    category: string;
    component: string;
    budgetPlanAmount: number;
    budgetRealisasiAmount: number;
    budgetRemainingAmount: number;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

export default function BudgetPlanForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: initialData?.id,
    year: initialData?.year ?? new Date().getFullYear(),
    coa: initialData?.coa ?? "",
    category: initialData?.category ?? "",
    component: initialData?.component ?? "",
    budgetPlanAmount:
      initialData?.budgetPlanAmount ?? 0,
  });

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      !form.coa ||
      !form.category ||
      !form.component ||
      form.budgetPlanAmount === null ||
      form.budgetPlanAmount === undefined
    ) {
      showToast(
        "error",
        "Field wajib belum lengkap"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/budget/opex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json?.error ?? "Gagal menyimpan data"
        );
      }

      showToast(
        "success",
        mode === "edit"
          ? "Budget Plan OPEX berhasil diperbarui"
          : "Budget Plan OPEX berhasil dibuat"
      );

      onSuccess();
    } catch (err: any) {
      showToast(
        "error",
        err?.message ?? "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* DISPLAY ID */}
      {initialData?.displayId && (
        <div>
          <label className="text-sm text-gray-600">
            Budget ID
          </label>
          <input
            disabled
            value={initialData.displayId}
            className="w-full mt-1 px-3 py-2 border rounded bg-gray-100"
          />
        </div>
      )}

      <div>
        <label className="text-sm font-medium">
          COA
        </label>
        <input
          className="w-full mt-1 px-3 py-2 border rounded"
          value={form.coa}
          onChange={(e) =>
            setForm({
              ...form,
              coa: e.target.value,
            })
          }
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Category
        </label>
        <input
          className="w-full mt-1 px-3 py-2 border rounded"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Component
        </label>
        <input
          className="w-full mt-1 px-3 py-2 border rounded"
          value={form.component}
          onChange={(e) =>
            setForm({
              ...form,
              component: e.target.value,
            })
          }
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Budget Plan
        </label>
        <input
          type="number"
          className="w-full mt-1 px-3 py-2 border rounded"
          value={form.budgetPlanAmount}
          onChange={(e) =>
            setForm({
              ...form,
              budgetPlanAmount: Number(
                e.target.value
              ),
            })
          }
          required
        />
      </div>

      {/* READ ONLY INFO */}
      {initialData && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">
              Budget Realisasi
            </label>
            <input
              disabled
              value={Number(
                initialData.budgetRealisasiAmount
              ).toLocaleString("id-ID")}
              className="w-full mt-1 px-3 py-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Budget Remaining
            </label>
            <input
              disabled
              value={Number(
                initialData.budgetRemainingAmount
              ).toLocaleString("id-ID")}
              className="w-full mt-1 px-3 py-2 border rounded bg-gray-100"
            />
          </div>
        </div>
      )}

      {/* ACTION */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
