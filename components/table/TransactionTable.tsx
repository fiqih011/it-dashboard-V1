"use client";

import React from "react";
import ScrollableTable from "@/components/table/ScrollableTable";
import TransactionActionCell from "@/components/table/TransactionActionCell";

export type TransactionRow = {
  id: string;
  displayId: string;
  budgetPlanDisplayId?: string; // ✅ SESUAI API

  vendor: string;
  requester: string;
  prNumber?: string;
  poType?: string;
  poNumber?: string;
  documentGr?: string;

  description: string;
  qty: number;
  amount: number | string;

  submissionDate?: string;
  approvedDate?: string;
  deliveryDate?: string;

  oc?: string;
  ccLob?: string;
  coa?: string;
  status?: string;
  notes?: string;
};

type Props = {
  rows: TransactionRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
};

/**
 * =========================================================
 * HELPER — FORMAT DATE (DD-MM-YYYY)
 * =========================================================
 */
function formatDate(value?: string): string {
  if (!value) return "-";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

export default function TransactionTable({
  rows,
  onEdit,
  onDelete,
}: Props) {
  if (rows.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        Tidak ada data transaksi.
      </div>
    );
  }

  return (
    <ScrollableTable minWidth={1200}>
      <div className="border rounded overflow-hidden">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 whitespace-nowrap w-[140px]">
                Transaction ID
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[120px]">
                Budget ID
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[180px]">
                Vendor
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[140px]">
                Requester
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[120px]">
                PR Number
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[90px]">
                PO
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[120px]">
                PO Number
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[120px]">
                GR
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[260px]">
                Description
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[60px] text-center">
                QTY
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[120px] text-right">
                Amount
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[120px]">
                Submit
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[120px]">
                Approve
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[120px]">
                Delivery
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[80px]">
                O / C
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[110px]">
                CC / LOB
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[90px]">
                COA
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[100px]">
                Status
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[140px]">
                Notes
              </th>
              <th className="px-2 py-2 whitespace-nowrap w-[110px] text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="px-2 py-2 whitespace-nowrap font-mono">
                  {row.displayId}
                </td>
                <td className="px-2 py-2 whitespace-nowrap font-mono">
                  {row.budgetPlanDisplayId ?? "-"}
                </td>

                <td className="px-2 py-2">
                  <div className="max-h-[1.5rem] whitespace-nowrap overflow-x-auto overflow-y-hidden pr-1">
                    {row.vendor}
                  </div>
                </td>

                <td className="px-2 py-2 whitespace-nowrap">
                  {row.requester}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {row.prNumber ?? "-"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {row.poType ?? "-"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {row.poNumber ?? "-"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {row.documentGr ?? "-"}
                </td>

                <td className="px-2 py-2">
                  <div className="max-h-[1.5rem] whitespace-nowrap overflow-x-auto overflow-y-hidden pr-1">
                    {row.description}
                  </div>
                </td>

                <td className="px-2 py-2 text-center whitespace-nowrap">
                  {row.qty}
                </td>
                <td className="px-2 py-2 text-right whitespace-nowrap">
                  {typeof row.amount === "number"
                    ? row.amount.toLocaleString("id-ID")
                    : row.amount}
                </td>

                <td className="px-2 py-2 whitespace-nowrap">
                  {formatDate(row.submissionDate)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {formatDate(row.approvedDate)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {formatDate(row.deliveryDate)}
                </td>

                <td className="px-2 py-2 whitespace-nowrap">
                  {row.oc ?? "-"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {row.ccLob ?? "-"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {row.coa ?? "-"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {row.status ?? "-"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {row.notes ?? "-"}
                </td>

                <td className="px-2 py-2 text-center whitespace-nowrap">
                  <TransactionActionCell
                    onEdit={() => onEdit(row.id)}
                    onDelete={() => onDelete(row.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ScrollableTable>
  );
}
