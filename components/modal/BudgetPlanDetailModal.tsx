"use client";

import Modal from "@/components/ui/Modal";

type Props = {
  open: boolean;
  data: any;
  transactions: any[];
  onClose: () => void;
};

export default function BudgetPlanDetailModal({
  open,
  data,
  transactions,
  onClose,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Detail Budget Plan">
      <div className="space-y-4 text-sm">
        <div>
          <div>ID: {data.displayId}</div>
          <div>COA / Item: {data.coaOrItem}</div>
          <div>Component: {data.componentOrDescription}</div>
          <div>Plan: {data.budgetPlan}</div>
          <div>Used: {data.budgetRealisasi}</div>
          <div>Remaining: {data.budgetRemaining}</div>
        </div>

        <div>
          <div className="font-semibold mb-1">Transaksi</div>
          {transactions.length === 0 ? (
            <div className="text-gray-500">
              Tidak ada transaksi.
            </div>
          ) : (
            <ul className="list-disc ml-4">
              {transactions.map((t, i) => (
                <li key={i}>
                  {t.date} — {t.description} — {t.amount}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
