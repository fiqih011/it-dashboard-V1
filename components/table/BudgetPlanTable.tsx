"use client";

import { useRouter } from "next/navigation";
import type { BudgetPlanOpex } from "@prisma/client";

import ActionCell from "./ActionCell";

type Props = {
  data: BudgetPlanOpex[];
  onEdit: (row: BudgetPlanOpex) => void;
  onDetail: (row: BudgetPlanOpex) => void;
};

export default function BudgetPlanTable({
  data,
  onEdit,
  onDetail,
}: Props) {
  const router = useRouter();

  return (
    <div className="border rounded overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">COA</th>
            <th className="px-3 py-2 text-left">Category</th>
            <th className="px-3 py-2 text-left">Component</th>
            <th className="px-3 py-2 text-right">Budget Plan</th>
            <th className="px-3 py-2 text-right">Budget Realisasi</th>
            <th className="px-3 py-2 text-right">Budget Remaining</th>
            <th className="px-3 py-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="py-6 text-center text-gray-500"
              >
                Tidak ada data
              </td>
            </tr>
          )}

          {data.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="px-3 py-2">{row.displayId}</td>
              <td className="px-3 py-2">{row.coa}</td>
              <td className="px-3 py-2">{row.category}</td>
              <td className="px-3 py-2">{row.component}</td>
              <td className="px-3 py-2 text-right">
                {Number(row.budgetPlanAmount).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-right">
                {Number(row.budgetRealisasiAmount).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-right">
                {Number(row.budgetRemainingAmount).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-center">
                <ActionCell
                  onEdit={() => onEdit(row)}
                  onInput={() =>
                router.push(
                `/input/transaction/opex?id=${row.id}&coa=${row.coa}`
                  )
                }
                  onDetail={() => onDetail(row)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
