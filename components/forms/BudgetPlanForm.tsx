"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { showError, showSuccess } from "@/lib/swal";

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
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: initialData?.id,
    year: initialData?.year ?? new Date().getFullYear(),
    coa: initialData?.coa ?? "",
    category: initialData?.category ?? "",
    component: initialData?.component ?? "",
    // ⬇️ STRING supaya default kosong
    budgetPlanAmount:
      initialData?.budgetPlanAmount !== undefined
        ? String(initialData.budgetPlanAmount)
        : "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.coa.trim() ||
      !form.category.trim() ||
      !form.component.trim() ||
      form.budgetPlanAmount === ""
    ) {
      showError("Field wajib belum lengkap");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/budget/opex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          year: form.year,
          coa: form.coa,
          category: form.category,
          component: form.component,
          // ⬇️ convert ke number saat submit
          budgetPlanAmount: Number(form.budgetPlanAmount),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal menyimpan data");
      }

      showSuccess(
        mode === "edit"
          ? "Budget Plan OPEX berhasil diperbarui"
          : "Budget Plan OPEX berhasil dibuat"
      );

      onSuccess();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* INFORMASI DASAR */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Informasi Dasar
        </h2>

        {initialData?.displayId && (
          <div>
            <label className="text-sm text-gray-600">Budget ID</label>
            <input
              disabled
              value={initialData.displayId}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded bg-gray-100 text-gray-700"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tahun
            </label>
            <input
              type="number"
              value={form.year}
              onChange={(e) =>
                setForm({ ...form, year: Number(e.target.value) })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              COA
            </label>
            <input
              value={form.coa}
              onChange={(e) =>
                setForm({ ...form, coa: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Component
            </label>
            <input
              value={form.component}
              onChange={(e) =>
                setForm({ ...form, component: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded"
              required
            />
          </div>
        </div>
      </div>

      {/* INFORMASI NOMINAL */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Informasi Nominal
        </h2>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Budget Plan
          </label>
          <input
            type="number"
            placeholder="Masukkan nominal budget"
            value={form.budgetPlanAmount}
            onChange={(e) =>
              setForm({
                ...form,
                budgetPlanAmount: e.target.value,
              })
            }
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-right"
            required
          />
        </div>

        {initialData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">
                Budget Realisasi
              </label>
              <input
                disabled
                value={Number(
                  initialData.budgetRealisasiAmount
                ).toLocaleString("id-ID")}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded bg-gray-100 text-right"
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
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded bg-gray-100 text-right"
              />
            </div>
          </div>
        )}
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-2 pt-6 border-t border-gray-200">
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
