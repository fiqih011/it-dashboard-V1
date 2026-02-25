"use client";

import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import ActionCell from "@/components/table/ActionCell";

export type BudgetPlanRow = {
  id: string;
  displayId: string;
  coa: string;
  category: string;
  component: string;
  totalBudget: number;
  totalRealisasi: number;
  remaining: number;
};

type Props = {
  data: BudgetPlanRow[];
  onEdit: (row: BudgetPlanRow) => void;
  onInput: (row: BudgetPlanRow) => void;
  onDetail: (row: BudgetPlanRow) => void;
};

type SortState = {
  key: keyof BudgetPlanRow | null;
  direction: "asc" | "desc" | null;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function BudgetPlanTable({ data, onEdit, onInput, onDetail }: Props) {
  const [sort, setSort] = useState<SortState>({ key: null, direction: null });

  function handleSort(key: keyof BudgetPlanRow) {
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
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sort]);

  function SortIcon({ column }: { column: keyof BudgetPlanRow }) {
    if (sort.key === column && sort.direction === "asc")
      return <ChevronUp className="ml-1 h-3 w-3 text-indigo-500" />;
    if (sort.key === column && sort.direction === "desc")
      return <ChevronDown className="ml-1 h-3 w-3 text-indigo-500" />;
    return <ChevronsUpDown className="ml-1 h-3 w-3 text-gray-300" />;
  }

  function Th({
    label,
    column,
    align = "left",
  }: {
    label: string;
    column: keyof BudgetPlanRow;
    align?: "left" | "right";
  }) {
    const isActive = sort.key === column;
    return (
      <th
        onClick={() => handleSort(column)}
        className={`px-4 py-2.5 text-xs font-bold tracking-wide uppercase cursor-pointer select-none border-r border-gray-200 transition-colors whitespace-nowrap ${
          align === "right" ? "text-right" : "text-left"
        } ${isActive ? "text-indigo-600 bg-indigo-50/60" : "text-gray-800 hover:bg-gray-50"}`}
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
        <p className="text-sm text-gray-400">No budget plan data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th label="Budget ID" column="displayId" />
              <Th label="COA" column="coa" />
              <Th label="Category" column="category" />
              <Th label="Component" column="component" />
              <Th label="Total Budget" column="totalBudget" align="right" />
              <Th label="Realization" column="totalRealisasi" align="right" />
              <Th label="Remaining" column="remaining" align="right" />
              <th className="px-4 py-2.5 text-xs font-bold text-gray-800 text-center uppercase tracking-wide">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {sortedData.map((row, index) => (
              <tr
                key={row.id}
                className={`transition-colors hover:bg-indigo-50/30 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
              >
                {/* Budget ID — subtle, monospace */}
                <td className="px-4 py-2.5 font-mono text-xs font-semibold text-gray-600 border-r border-gray-200">
                  {row.displayId}
                </td>
                {/* COA */}
                <td className="px-4 py-2.5 text-xs font-mono text-gray-500 border-r border-gray-200">
                  {row.coa}
                </td>
                {/* Category */}
                <td className="px-4 py-2.5 text-sm text-gray-600 border-r border-gray-200">
                  {row.category}
                </td>
                {/* Component */}
                <td className="px-4 py-2.5 text-sm text-gray-800 font-medium border-r border-gray-200 max-w-xs">
                  {row.component}
                </td>
                {/* Total Budget */}
                <td className="px-4 py-2.5 text-sm text-right tabular-nums text-gray-700 border-r border-gray-200">
                  {formatCurrency(row.totalBudget)}
                </td>
                {/* Realization */}
                <td className="px-4 py-2.5 text-sm text-right tabular-nums text-gray-700 border-r border-gray-200">
                  {formatCurrency(row.totalRealisasi)}
                </td>
                {/* Remaining — hanya merah kalau minus, sisanya normal */}
                <td className={`px-4 py-2.5 text-sm text-right tabular-nums font-medium border-r border-gray-200 ${
                  row.remaining < 0 ? "text-red-600" : "text-gray-800"
                }`}>
                  {formatCurrency(row.remaining)}
                </td>
                {/* Action */}
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