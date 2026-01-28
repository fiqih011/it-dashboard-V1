"use client";

import { useMemo, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import TransactionActionCell from "@/components/table/TransactionActionCell";

/**
 * =========================================
 * TYPES — CAPEX (FIXED)
 * =========================================
 */
export type TransactionCapexRow = {
  id: string;

  transactionDisplayId: string;
  budgetPlanCapexId: string;

  vendor: string;
  requester: string;

  projectCode?: string | null;
  noUi?: string | null;

  prNumber?: string | null;
  poType?: string | null;
  poNumber?: string | null;
  documentGr?: string | null;

  description: string;
  qty: number;
  amount: number;

  assetNumber?: string | null;

  submissionDate?: string | null;
  approvedDate?: string | null;

  /** ✅ PAKAI INI, BUKAN deliveryDate */
  deliveryStatus?: string | null;

  oc?: string | null;
  ccLob?: string | null;
  status: string;
  notes?: string | null;
};

type Props = {
  rows?: TransactionCapexRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
};

type SortState = {
  key: keyof TransactionCapexRow | null;
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
 * COMPONENT — CAPEX TABLE
 * =========================================
 */
export default function TransactionCapexTable({
  rows = [],
  onEdit,
  onDelete,
}: Props) {
  const [sort, setSort] = useState<SortState>({
    key: null,
    direction: null,
  });

  function handleSort(key: keyof TransactionCapexRow) {
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

  function SortIcon({ column }: { column: keyof TransactionCapexRow }) {
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
    column: keyof TransactionCapexRow;
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
        Tidak ada data transaksi CAPEX
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table
        className="w-full border-collapse bg-white border border-gray-200 rounded-xl shadow-sm"
        style={{ minWidth: "2200px" }}
      >
        <thead>
          <tr>
            <Th label="Transaction ID" column="transactionDisplayId" />
            <Th label="Budget ID" column="budgetPlanCapexId" />
            <Th label="Vendor" column="vendor" />
            <Th label="Requester" column="requester" />
            <Th label="Project Code" column="projectCode" />
            <Th label="No UI" column="noUi" />
            <Th label="PR Number" column="prNumber" />
            <Th label="PO Type" column="poType" />
            <Th label="PO Number" column="poNumber" />
            <Th label="Document GR" column="documentGr" />
            <Th label="Description" column="description" />
            <Th label="QTY" column="qty" align="right" />
            <Th label="Amount" column="amount" align="right" />
            <Th label="Asset Number" column="assetNumber" />
            <Th label="Submit" column="submissionDate" />
            <Th label="Approve" column="approvedDate" />
            <Th label="Delivery" column="deliveryStatus" />
            <Th label="O / C" column="oc" />
            <Th label="CC / LOB" column="ccLob" />
            <Th label="Status" column="status" />
            <Th label="Notes" column="notes" />
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
                {row.transactionDisplayId}
              </td>
              <td className="px-4 py-3 border border-gray-200 font-mono whitespace-nowrap">
                {row.budgetPlanCapexId}
              </td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.vendor}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.requester}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.projectCode ?? "-"}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.noUi ?? "-"}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.prNumber ?? "-"}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.poType ?? "-"}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.poNumber ?? "-"}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.documentGr ?? "-"}</td>
              <td className="px-4 py-3 border border-gray-200 min-w-[250px]">{row.description}</td>
              <td className="px-4 py-3 border border-gray-200 text-right whitespace-nowrap">{row.qty}</td>
              <td className="px-4 py-3 border border-gray-200 text-right whitespace-nowrap">
                {formatCurrency(row.amount)}
              </td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.assetNumber ?? "-"}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{formatDate(row.submissionDate)}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{formatDate(row.approvedDate)}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                {row.deliveryStatus ?? "-"}
              </td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.oc ?? "CAPEX"}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.ccLob ?? "-"}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.status}</td>
              <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">{row.notes ?? "-"}</td>
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
  );
}
