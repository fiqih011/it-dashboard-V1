"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { showError, showSuccess } from "@/lib/swal";

type Props = {
  mode: "edit" | "create";
  initialData?: {
    id?: string;
    budgetDisplayId?: string;
    year: number;
    itemCode: string;
    itemDescription: string;
    noCapex?: string | null;
    itemRemark?: string | null;
    budgetPlanAmount: number;
    budgetRealisasiAmount: number;
    budgetRemainingAmount: number;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

export default function BudgetPlanCapexForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: initialData?.id,
    year: initialData?.year ?? new Date().getFullYear(),
    itemCode: initialData?.itemCode ?? "",
    itemDescription: initialData?.itemDescription ?? "",
    noCapex: initialData?.noCapex ?? "",
    itemRemark: initialData?.itemRemark ?? "",
    budgetPlanAmount:
      initialData?.budgetPlanAmount !== undefined
        ? String(initialData.budgetPlanAmount)
        : "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.itemCode.trim() ||
      !form.itemDescription.trim() ||
      form.budgetPlanAmount === ""
    ) {
      showError("Field wajib belum lengkap");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/budget/capex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          year: form.year,
          itemCode: form.itemCode,
          itemDescription: form.itemDescription,
          noCapex: form.noCapex || null,
          itemRemark: form.itemRemark || null,
          budgetPlanAmount: Number(form.budgetPlanAmount),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal menyimpan data");
      }

      showSuccess(
        mode === "edit"
          ? "Budget Plan CAPEX berhasil diperbarui"
          : "Budget Plan CAPEX berhasil dibuat"
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

        {initialData?.budgetDisplayId && (
          <div>
            <label className="text-sm text-gray-600">Budget ID</label>
            <input
              disabled
              value={initialData.budgetDisplayId}
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
              Item Code
            </label>
            <input
              value={form.itemCode}
              onChange={(e) =>
                setForm({ ...form, itemCode: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Item Description
          </label>
          <input
            value={form.itemDescription}
            onChange={(e) =>
              setForm({ ...form, itemDescription: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              No CAPEX
            </label>
            <input
              value={form.noCapex}
              onChange={(e) =>
                setForm({ ...form, noCapex: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Item Remark
            </label>
            <input
              value={form.itemRemark}
              onChange={(e) =>
                setForm({ ...form, itemRemark: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded"
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
              setForm({ ...form, budgetPlanAmount: e.target.value })
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
