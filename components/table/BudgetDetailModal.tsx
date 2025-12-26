"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  vendor: string;
  description: string;
  qty: number;
  amount: number;
  deliveryDate: string | null;
  status: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  type: "opex" | "capex";
  budgetPlanId: string;
  title: string;
};

export default function BudgetDetailModal({
  open,
  onClose,
  type,
  budgetPlanId,
  title,
}: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/transaction/${type}?budgetPlanId=${budgetPlanId}`
      );
      const json = await res.json();
      setRows(json.data ?? []);
      setLoading(false);
    };

    load();
  }, [open, type, budgetPlanId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded shadow">
        <div className="px-4 py-3 border-b font-semibold text-sm">
          Detail Transaksi — {title}
        </div>

        <div className="p-4 text-sm">
          {loading && <div>Loading...</div>}

          {!loading && rows.length === 0 && (
            <div className="text-gray-500">Tidak ada transaksi</div>
          )}

          {!loading && rows.length > 0 && (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Vendor</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right">Amount</th>
                  <th className="p-2 text-left">Delivery</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.vendor}</td>
                    <td className="p-2">{r.description}</td>
                    <td className="p-2 text-right">{r.qty}</td>
                    <td className="p-2 text-right">{r.amount}</td>
                    <td className="p-2">
                      {r.deliveryDate
                        ? new Date(r.deliveryDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-4 py-3 border-t text-right">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm border rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
