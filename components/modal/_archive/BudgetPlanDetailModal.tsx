"use client";

import type { BudgetPlanOpex } from "@prisma/client";

type Props = {
  open: boolean;
  data: BudgetPlanOpex;
  onClose: () => void;
};

export default function BudgetPlanDetailModal({
  open,
  data,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded w-full max-w-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Detail Transaksi OPEX
        </h2>

        <div className="space-y-2 text-sm">
          <div>
            <strong>ID:</strong> {data.displayId}
          </div>
          <div>
            <strong>COA:</strong> {data.coa}
          </div>
          <div>
            <strong>Category:</strong> {data.category}
          </div>
          <div>
            <strong>Component:</strong> {data.component}
          </div>
        </div>

        <div className="mt-6 text-gray-500 text-sm">
          Data transaksi OPEX akan ditampilkan di sini
          (read-only).
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
