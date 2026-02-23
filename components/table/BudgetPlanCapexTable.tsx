"use client";

import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import ActionCell from "@/components/table/ActionCell";

export type BudgetPlanCapexRow = {
  id: string;
  budgetId: string;
  itemCode: string;
  itemDescription: string;
  noCapex: string | null;
  itemRemark: string;
  totalBudget: number;
  totalRealisasi: number;
  remaining: number;
};

type Props = {
  data: BudgetPlanCapexRow[];
  onEdit: (row: BudgetPlanCapexRow) => void;
  onInput: (row: BudgetPlanCapexRow) => void;
  onDetail: (row: BudgetPlanCapexRow) => void;
};

type SortState = {
  key: keyof BudgetPlanCapexRow | null;
  direction: "asc" | "desc" | null;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function BudgetPlanCapexTable({ data, onEdit, onInput, onDetail }: Props) {
  const [sort, setSort] = useState<SortState>({ key: null, direction: null });

  function handleSort(key: keyof BudgetPlanCapexRow) {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      if (prev.direction === "desc") return { key: null, direction: null };
      return { key, direction: "asc" };
    });
  }

  const sortedData = useMemo(() => {
    if (!sort.key || !sort.direction) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sort.key!];
      const bVal = b[sort.key!];
      if (typeof aVal === "number" && typeof bVal === "number")
        return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
      return sort.direction === "asc"
        ? String(aVal ?? "").localeCompare(String(bVal ?? ""))
        : String(bVal ?? "").localeCompare(String(aVal ?? ""));
    });
  }, [data, sort]);

  function SortIcon({ column }: { column: keyof BudgetPlanCapexRow }) {
    if (sort.key === column && sort.direction === "asc")
      return <ChevronUp className="ml-1 h-3 w-3 text-indigo-500" />;
    if (sort.key === column && sort.direction === "desc")
      return <ChevronDown className="ml-1 h-3 w-3 text-indigo-500" />;
    return <ChevronsUpDown className="ml-1 h-3 w-3 text-gray-300" />;
  }

  function Th({ label, column, align = "left" }: {
    label: string;
    column: keyof BudgetPlanCapexRow;
    align?: "left" | "right";
  }) {
    const isActive = sort.key === column;
    return (
      <th
        onClick={() => handleSort(column)}
        className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wide cursor-pointer select-none border-r border-gray-200 whitespace-nowrap transition-colors ${
          align === "right" ? "text-right" : "text-left"
        } ${isActive ? "text-indigo-600 bg-indigo-50/60" : "text-gray-800 hover:bg-gray-100"}`}
      >
        <span className="inline-flex items-center">
          {label}
          <SortIcon column={column} />
        </span>
      </th>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Tidak ada data budget plan CAPEX.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th label="Budget ID" column="budgetId" />
              <Th label="Item Code" column="itemCode" />
              <Th label="Item Description" column="itemDescription" />
              <Th label="No CAPEX" column="noCapex" />
              <Th label="Item Remark" column="itemRemark" />
              <Th label="Total Budget" column="totalBudget" align="right" />
              <Th label="Realisasi" column="totalRealisasi" align="right" />
              <Th label="Remaining" column="remaining" align="right" />
              <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-800 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-gray-200 transition-colors hover:bg-indigo-50/30 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
              >
                <td className="px-4 py-2.5 font-mono text-xs font-semibold text-gray-600 border-r border-gray-200">
                  {row.budgetId}
                </td>
                <td className="px-4 py-2.5 text-xs font-mono text-gray-500 border-r border-gray-200">
                  {row.itemCode}
                </td>
                <td className="px-4 py-2.5 text-gray-800 font-medium border-r border-gray-200">
                  {row.itemDescription}
                </td>
                <td className="px-4 py-2.5 text-gray-500 border-r border-gray-200">
                  {row.noCapex ?? "-"}
                </td>
                <td className="px-4 py-2.5 text-gray-600 border-r border-gray-200">
                  {row.itemRemark}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-gray-700 border-r border-gray-200">
                  {formatCurrency(row.totalBudget)}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-gray-700 border-r border-gray-200">
                  {formatCurrency(row.totalRealisasi)}
                </td>
                <td className={`px-4 py-2.5 text-right tabular-nums font-medium border-r border-gray-200 ${
                  row.remaining < 0 ? "text-red-600" : "text-gray-800"
                }`}>
                  {formatCurrency(row.remaining)}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <ActionCell
                    onDetail={() => onDetail(row)}
                    onInput={() => onInput(row)}
                    onEdit={() => onEdit(row)}
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