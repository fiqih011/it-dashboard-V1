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
 * TYPES — JANGAN DIUBAH
 * =========================================
 */
export type TransactionRow = {
  id: string;

  displayId: string;
  budgetPlanDisplayId?: string | null;

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
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
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

function StatusBadge({ status }: { status: string }) {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold";

  switch (status) {
    case "Approved":
      return (
        <span className={`${base} bg-emerald-100 text-emerald-700`}>
          Approved
        </span>
      );
    case "Pending":
      return (
        <span className={`${base} bg-amber-100 text-amber-700`}>
          Pending
        </span>
      );
    case "In Progress":
      return (
        <span className={`${base} bg-blue-100 text-blue-700`}>
          In Progress
        </span>
      );
    default:
      return (
        <span className={`${base} bg-gray-100 text-gray-600`}>
          {status}
        </span>
      );
  }
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

  console.log("🔥 STICKY TABLE - GAP FIXED VERSION!");

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
        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide
        text-gray-600 bg-gray-50 border-b border-gray-200
        cursor-pointer select-none whitespace-nowrap
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
      <div className="py-12 text-center text-sm text-gray-500 bg-white border border-gray-200 rounded-xl shadow-sm">
        Tidak ada data transaksi
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: "2200px" }}>
          <thead>
            <tr>
              {/* 🔥 STICKY: Transaction ID */}
              <th
                onClick={() => handleSort("displayId")}
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 30,
                  backgroundColor: "#f9fafb",
                  minWidth: "150px",
                  width: "150px",
                }}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 border-b border-gray-200 border-r-2 border-r-gray-300 cursor-pointer select-none whitespace-nowrap text-left"
              >
                <span className="inline-flex items-center">
                  Transaction ID
                  <SortIcon column="displayId" />
                </span>
              </th>

              {/* 🔥 STICKY: Budget ID - ADJUSTED OFFSET */}
              <th
                onClick={() => handleSort("budgetPlanDisplayId")}
                style={{
                  position: "sticky",
                  left: 150,
                  zIndex: 30,
                  backgroundColor: "#f9fafb",
                  minWidth: "130px",
                  width: "130px",
                }}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 border-b border-gray-200 border-r-2 border-r-gray-300 cursor-pointer select-none whitespace-nowrap text-left"
              >
                <span className="inline-flex items-center">
                  Budget ID
                  <SortIcon column="budgetPlanDisplayId" />
                </span>
              </th>

              {/* REGULAR COLUMNS */}
              <Th label="Vendor" column="vendor" />
              <Th label="Requester" column="requester" />
              <Th label="PR" column="prNumber" />
              <Th label="PO" column="poNumber" />
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
              
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 bg-gray-50 border-b border-gray-200 text-center whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* 🔥 STICKY: Transaction ID */}
                <td
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 20,
                    backgroundColor: "white",
                    minWidth: "150px",
                    width: "150px",
                  }}
                  className="px-4 py-3 font-mono text-gray-900 whitespace-nowrap border-r-2 border-r-gray-200"
                >
                  {row.displayId}
                </td>

                {/* 🔥 STICKY: Budget ID - ADJUSTED OFFSET */}
                <td
                  style={{
                    position: "sticky",
                    left: 150,
                    zIndex: 20,
                    backgroundColor: "white",
                    minWidth: "130px",
                    width: "130px",
                  }}
                  className="px-4 py-3 font-mono text-gray-700 whitespace-nowrap border-r-2 border-r-gray-200"
                >
                  {row.budgetPlanDisplayId ?? "-"}
                </td>

                {/* REGULAR COLUMNS */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {row.vendor}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {row.requester}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {row.prNumber ?? "-"}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {row.poNumber ?? "-"}
                </td>

                <td className="px-4 py-3 min-w-[250px] text-gray-700">
                  {row.description}
                </td>

                <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                  {row.qty}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                  {formatCurrency(row.amount)}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(row.submissionDate)}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(row.approvedDate)}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(row.deliveryDate)}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {row.oc ?? "-"}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {row.ccLob ?? "-"}
                </td>

                <td className="px-4 py-3 font-mono whitespace-nowrap">
                  {row.coa ?? "-"}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={row.status} />
                </td>

                <td className="px-4 py-3 text-center whitespace-nowrap">
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
    </div>
  );
}