"use client";

import { useMemo, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import TransactionActionCell from "@/components/table/TransactionActionCell";
import ScrollableTable from "@/components/table/ScrollableTable";

/**
 * =========================================
 * TYPES — SESUAI API (JANGAN DIUBAH LAGI)
 * =========================================
 */
export type TransactionRow = {
  id: string; // UUID (UNTUK ACTION)

  displayId: string; // TRX-OP-25-0145 ✅
  budgetPlanDisplayId?: string | null; // OP-250029 ✅

  vendor: string;
  requester: string;
  prNumber?: string | null;
  poType?: string | null;
  poNumber?: string | null;
  grNumber?: string | null;

  description: string;
  qty: number;
  amount: number;

  submissionDate?: string | null;
  approvedDate?: string | null;
  deliveryDate?: string | null;

  oc?: string | null;
  ccLob?: string | null;
  coa?: string | null;
  status: string;
};

type Props = {
  rows: TransactionRow[];
  onEdit: (id: string) => void;        // UUID
  onDelete: (id: string) => Promise<boolean>; // UUID
};

type SortState = {
  key: keyof TransactionRow | null;
  direction: "asc" | "desc" | null;
};

/**
 * =========================================
 * HELPERS
 * =========================================
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(val?: string | null): string {
  if (!val) return "-";
  return new Date(val).toLocaleDateString("id-ID");
}

/**
 * =========================================
 * COMPONENT
 * =========================================
 */
export default function TransactionTable({
  rows,
  onEdit,
  onDelete,
}: Props) {
  const [sort, setSort] = useState<SortState>({
    key: null,
    direction: null,
  });

  function handleSort(key: keyof TransactionRow) {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      if (prev.direction === "desc") return { key: null, direction: null };
      return { key, direction: "asc" };
    });
  }

  const sortedRows = useMemo(() => {
    if (!sort.key || !sort.direction) return rows;

    const key = sort.key;
    const dir = sort.direction;

    return [...rows].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return dir === "asc" ? aVal - bVal : bVal - aVal;
      }

      return dir === "asc"
        ? String(aVal ?? "").localeCompare(String(bVal ?? ""))
        : String(bVal ?? "").localeCompare(String(aVal ?? ""));
    });
  }, [rows, sort]);

  function SortIcon({ column }: { column: keyof TransactionRow }) {
    if (sort.key === column && sort.direction === "asc") {
      return <ChevronUp className="ml-1 h-4 w-4" />;
    }
    if (sort.key === column && sort.direction === "desc") {
      return <ChevronDown className="ml-1 h-4 w-4" />;
    }
    return <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-400" />;
  }

  function Th({
    label,
    column,
    align = "left",
  }: {
    label: string;
    column: keyof TransactionRow;
    align?: "left" | "right";
  }) {
    return (
      <th
        onClick={() => handleSort(column)}
        className={`px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer
        border border-gray-200 bg-slate-50 select-none whitespace-nowrap
        ${align === "right" ? "text-right" : "text-left"}`}
      >
        <span className="inline-flex items-center">
          {label}
          <SortIcon column={column} />
        </span>
      </th>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Tidak ada data transaksi
      </div>
    );
  }

  return (
    <ScrollableTable minWidth={2400}>
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th label="Transaction ID" column="displayId" />
              <Th label="Budget ID" column="budgetPlanDisplayId" />
              <Th label="Vendor" column="vendor" />
              <Th label="Requester" column="requester" />
              <Th label="PR" column="prNumber" />
              <Th label="PO" column="poNumber" />
              <Th label="GR" column="grNumber" />
              <Th label="Description" column="description" />
              <Th label="QTY" column="qty" align="right" />
              <Th label="Amount" column="amount" align="right" />
              <Th label="Submit" column="submissionDate" />
              <Th label="Approve" column="approvedDate" />
              <Th label="Delivery" column="deliveryDate" />
              <Th label="O / C" column="oc" />
              <Th label="CC / LOB" column="ccLob" />
              <Th label="COA" column="coa" />
              <Th label="Status" column="status" />
              <th className="px-4 py-3 text-sm font-semibold text-center border border-gray-200 bg-slate-50 whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedRows.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="px-4 py-3 border border-gray-200 font-mono whitespace-nowrap">
                  {row.displayId}
                </td>
                <td className="px-4 py-3 border border-gray-200 font-mono whitespace-nowrap">
                  {row.budgetPlanDisplayId ?? "-"}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.vendor}</td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.requester}</td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.prNumber ?? "-"}</td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.poNumber ?? "-"}</td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.grNumber ?? "-"}</td>
                <td className="px-4 py-3 border border-gray-200 min-w-[250px]">{row.description}</td>
                <td className="px-4 py-3 border border-gray-200 text-right whitespace-nowrap">{row.qty}</td>
                <td className="px-4 py-3 border border-gray-200 text-right whitespace-nowrap">
                  {formatCurrency(row.amount)}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {formatDate(row.submissionDate)}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {formatDate(row.approvedDate)}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {formatDate(row.deliveryDate)}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.oc ?? "-"}</td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.ccLob ?? "-"}</td>
                <td className="px-4 py-3 border border-gray-200 font-mono whitespace-nowrap">{row.coa ?? "-"}</td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.status}</td>
                <td className="px-4 py-3 border border-gray-200 text-center whitespace-nowrap">
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