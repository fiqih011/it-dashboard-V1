"use client";

import { useState } from "react";
import BudgetDetailModal from "./BudgetDetailModal";

type Props = {
  displayId: string;
  type: "opex" | "capex";
  budgetPlanId: string;
  onEdit: () => void;
  onInput: () => void;
};

export default function ActionCell({
  displayId,
  type,
  budgetPlanId,
  onEdit,
  onInput,
}: Props) {
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <>
      <div className="flex gap-2 text-xs">
        <button onClick={onEdit} className="text-blue-600 hover:underline">
          Edit
        </button>
        <button onClick={onInput} className="text-green-600 hover:underline">
          Input Transaksi
        </button>
        <button
          onClick={() => setOpenDetail(true)}
          className="text-gray-600 hover:underline"
        >
          Lihat Detail
        </button>
      </div>

      <BudgetDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        type={type}
        budgetPlanId={budgetPlanId}
        title={displayId}
      />
    </>
  );
}
