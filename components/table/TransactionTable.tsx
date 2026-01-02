"use client";

import ScrollableTable from "./ScrollableTable";
import TransactionActionCell from "./TransactionActionCell";

export type TransactionRow = {
  id: string;            // UUID (internal)
  displayId: string;     // Transaction ID (TRX-OP-xxxx)
  vendor: string;
  requester: string;
  prNumber?: string | null;
  poType?: string | null;
  poNumber?: string | null;
  documentGr?: string | null;
  description: string;
  qty: number;
  amount: string;
  submissionDate?: string | null;
  approvedDate?: string | null;
  deliveryDate?: string | null;
  oc?: string | null;
  ccLob?: string | null;
  coa: string;
  status: string;
  notes?: string | null;
};

type Props = {
  rows: TransactionRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
};

export default function TransactionTable({
  rows,
  onEdit,
  onDelete,
}: Props) {
  return (
    <ScrollableTable minWidth={2200}>
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            {[
              "Transaction ID",
              "Vendor",
              "Requester",
              "PR Number",
              "PO / Non PO",
              "PO Number",
              "Document GR",
              "Description",
              "QTY",
              "Amount",
              "Submission Date",
              "Approved Date",
              "Delivery Date",
              "O / C",
              "CC / LOB",
              "COA",
              "Status",
              "Notes",
              "Action",
            ].map((h) => (
              <th
                key={h}
                className="border px-3 py-2 text-left font-semibold whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={19}
                className="border px-4 py-6 text-center text-gray-500"
              >
                Tidak ada data transaksi
              </td>
            </tr>
          )}

          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{r.displayId}</td>
              <td className="border px-3 py-2">{r.vendor}</td>
              <td className="border px-3 py-2">{r.requester}</td>
              <td className="border px-3 py-2">{r.prNumber ?? "-"}</td>
              <td className="border px-3 py-2">{r.poType ?? "-"}</td>
              <td className="border px-3 py-2">{r.poNumber ?? "-"}</td>
              <td className="border px-3 py-2">{r.documentGr ?? "-"}</td>
              <td className="border px-3 py-2">{r.description}</td>
              <td className="border px-3 py-2 text-right">{r.qty}</td>
              <td className="border px-3 py-2 text-right">
                {Number(r.amount).toLocaleString("id-ID")}
              </td>
              <td className="border px-3 py-2">{r.submissionDate ?? "-"}</td>
              <td className="border px-3 py-2">{r.approvedDate ?? "-"}</td>
              <td className="border px-3 py-2">{r.deliveryDate ?? "-"}</td>
              <td className="border px-3 py-2">{r.oc ?? "-"}</td>
              <td className="border px-3 py-2">{r.ccLob ?? "-"}</td>
              <td className="border px-3 py-2">{r.coa}</td>
              <td className="border px-3 py-2">{r.status}</td>
              <td className="border px-3 py-2">{r.notes ?? "-"}</td>
              <td className="border px-3 py-2 text-center">
                <TransactionActionCell
                  onEdit={() => onEdit(r.id)}
                  onDelete={() => onDelete(r.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollableTable>
  );
}
