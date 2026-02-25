"use client";

import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import TransactionActionCell from "@/components/table/TransactionActionCell";

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
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";
  switch (status) {
    case "Approved":
      return <span className={`${base} bg-emerald-100 text-emerald-700`}>Approved</span>;
    case "Pending":
      return <span className={`${base} bg-amber-100 text-amber-700`}>Pending</span>;
    case "In Progress":
      return <span className={`${base} bg-blue-100 text-blue-700`}>In Progress</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
  }
}

export default function TransactionCapexTable({ rows = [], onEdit, onDelete }: Props) {
  const [sort, setSort] = useState<SortState>({ key: null, direction: null });

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
      if (typeof aVal === "number" && typeof bVal === "number")
        return dir === "asc" ? aVal - bVal : bVal - aVal;
      return dir === "asc"
        ? String(aVal ?? "").localeCompare(String(bVal ?? ""))
        : String(bVal ?? "").localeCompare(String(aVal ?? ""));
    });
  }, [rows, sort]);

  function SortIcon({ column }: { column: keyof TransactionCapexRow }) {
    if (sort.key === column && sort.direction === "asc")
      return <ChevronUp className="ml-1 h-3 w-3 text-indigo-500" />;
    if (sort.key === column && sort.direction === "desc")
      return <ChevronDown className="ml-1 h-3 w-3 text-indigo-500" />;
    return <ChevronsUpDown className="ml-1 h-3 w-3 text-gray-300" />;
  }

  // Th styles — same as BudgetPlanTable
  const thBase = "px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-800 bg-gray-50 border-b border-gray-200 cursor-pointer select-none whitespace-nowrap";

  function Th({ label, column, align = "left" }: {
    label: string;
    column: keyof TransactionCapexRow;
    align?: "left" | "right";
  }) {
    const isActive = sort.key === column;
    return (
      <th
        onClick={() => handleSort(column)}
        className={`${thBase} ${align === "right" ? "text-right" : "text-left"} ${isActive ? "text-indigo-600 bg-indigo-50/60" : "hover:bg-gray-100"}`}
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
      <div className="py-16 text-center text-sm text-gray-400 bg-white border border-gray-200 rounded-2xl shadow-sm">
        Tidak ada data transaksi CAPEX
      </div>
    );
  }

  // Sticky header bg
  const stickyBg = "#f3f4f6";
  const stickyThClass = `${thBase} text-gray-800 text-left`;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="w-full overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#c7d2fe #f1f5f9" }}>
        <table className="w-full text-sm" style={{ minWidth: "2200px" }}>
          <thead>
            <tr>
              {/* STICKY: Transaction ID */}
              <th
                onClick={() => handleSort("transactionDisplayId")}
                style={{ position: "sticky", left: 0, zIndex: 30, backgroundColor: stickyBg, minWidth: 150, width: 150, boxShadow: "inset -2px 0 0 #e5e7eb" }}
                className={stickyThClass}
              >
                <span className="inline-flex items-center">
                  Transaction ID <SortIcon column="transactionDisplayId" />
                </span>
              </th>

              {/* STICKY: Budget ID */}
              <th
                onClick={() => handleSort("budgetPlanCapexId")}
                style={{ position: "sticky", left: 150, zIndex: 30, backgroundColor: stickyBg, minWidth: 130, width: 130, boxShadow: "inset -2px 0 0 #e5e7eb" }}
                className={stickyThClass}
              >
                <span className="inline-flex items-center">
                  Budget ID <SortIcon column="budgetPlanCapexId" />
                </span>
              </th>

              <Th label="Vendor" column="vendor" />
              <Th label="Requester" column="requester" />
              <Th label="Project Code" column="projectCode" />
              <Th label="No UI" column="noUi" />
              <Th label="PR" column="prNumber" />
              <Th label="PO Type" column="poType" />
              <Th label="PO" column="poNumber" />
              <Th label="GR" column="documentGr" />
              <Th label="Description" column="description" />
              <Th label="QTY" column="qty" align="right" />
              <Th label="Amount" column="amount" align="right" />
              <Th label="Asset No" column="assetNumber" />
              <Th label="Submit" column="submissionDate" />
              <Th label="Approve" column="approvedDate" />
              <Th label="Delivery" column="deliveryStatus" />
              <Th label="O / C" column="oc" />
              <Th label="CC / LOB" column="ccLob" />
              <Th label="Status" column="status" />
              <Th label="Notes" column="notes" />

              <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-800 bg-gray-50 border-b border-gray-200 text-center whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedRows.map((row, index) => {
              const isEven = index % 2 === 0;
              const rowBg = isEven ? "white" : "#f3f4f6";

              return (
                <tr
                  key={row.id}
                  className={`border-b border-gray-200 transition-colors hover:bg-indigo-50/30 ${isEven ? "bg-white" : "bg-gray-100"}`}
                >
                  {/* STICKY: Transaction ID */}
                  <td
                    style={{ position: "sticky", left: 0, zIndex: 20, backgroundColor: rowBg, minWidth: 150, width: 150, boxShadow: "inset -2px 0 0 #e5e7eb" }}
                    className="px-4 py-2.5 font-mono text-xs font-semibold text-gray-600 whitespace-nowrap"
                  >
                    {row.transactionDisplayId}
                  </td>

                  {/* STICKY: Budget ID */}
                  <td
                    style={{ position: "sticky", left: 150, zIndex: 20, backgroundColor: rowBg, minWidth: 130, width: 130, boxShadow: "inset -2px 0 0 #e5e7eb" }}
                    className="px-4 py-2.5 font-mono text-xs font-semibold text-gray-600 whitespace-nowrap"
                  >
                    {row.budgetPlanCapexId}
                  </td>

                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-700 border-r border-gray-200">{row.vendor}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-700 border-r border-gray-200">{row.requester}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{row.projectCode ?? "-"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{row.noUi ?? "-"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{row.prNumber ?? "-"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{row.poType ?? "-"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{row.poNumber ?? "-"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{row.documentGr ?? "-"}</td>
                  <td className="px-4 py-2.5 min-w-[200px] text-gray-700 border-r border-gray-200">{row.description}</td>
                  <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap text-gray-700 border-r border-gray-200">{row.qty}</td>
                  <td className="px-4 py-2.5 text-right font-semibold whitespace-nowrap text-gray-800 border-r border-gray-200">{formatCurrency(row.amount)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{row.assetNumber ?? "-"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{formatDate(row.submissionDate)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{formatDate(row.approvedDate)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{row.deliveryStatus ?? "-"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{row.oc ?? "-"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{row.ccLob ?? "-"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap border-r border-gray-200">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-500 border-r border-gray-200">{row.notes ?? "-"}</td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    <TransactionActionCell
                      onEdit={() => onEdit(row.id)}
                      onDelete={() => onDelete(row.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}