"use client";

import { useMemo, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import ActionCell from "@/components/table/ActionCell";

export type BudgetPlanRow = {
  id: string;
  displayId: string;
  coa: string;              // ✅ DITAMBAHKAN
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

export default function BudgetPlanTable({
  data,
  onEdit,
  onInput,
  onDetail,
}: Props) {
  const [sort, setSort] = useState<SortState>({
    key: null,
    direction: null,
  });

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

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sort.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sort]);

  function SortIcon({ column }: { column: keyof BudgetPlanRow }) {
    if (sort.key === column && sort.direction === "asc") {
      return <ChevronUp className="ml-1 h-4 w-4 text-gray-700" />;
    }
    if (sort.key === column && sort.direction === "desc") {
      return <ChevronDown className="ml-1 h-4 w-4 text-gray-700" />;
    }
    return <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-400" />;
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
    return (
      <th
        onClick={() => handleSort(column)}
        className={`px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer select-none border-r border-gray-200 hover:bg-slate-100 ${
          align === "right" ? "text-right" : "text-left"
        }`}
      >
        <span className="inline-flex items-center">
          {label}
          <SortIcon column={column} />
        </span>
      </th>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <Th label="Budget ID" column="displayId" />
              <Th label="COA" column="coa" />
              <Th label="Category" column="category" />
              <Th label="Component" column="component" />
              <Th label="Total Budget" column="totalBudget" align="right" />
              <Th label="Realisasi" column="totalRealisasi" align="right" />
              <Th label="Remaining" column="remaining" align="right" />
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((row, index) => {
              const remainingClass =
                row.remaining < 0
                  ? "text-red-600"
                  : row.remaining === 0
                  ? "text-amber-600"
                  : "text-gray-900";

              return (
                <tr
                  key={row.id}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-100"
                  } hover:bg-slate-200/40`}
                >
                  <td className="px-4 py-3 text-sm font-medium border-r border-gray-200">
                    {row.displayId}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600 border-r border-gray-200">
                    {row.coa}
                  </td>
                  <td className="px-4 py-3 text-sm border-r border-gray-200">
                    {row.category}
                  </td>
                  <td className="px-4 py-3 text-sm border-r border-gray-200">
                    {row.component}
                  </td>
                  <td className="px-4 py-3 text-sm text-right tabular-nums border-r border-gray-200">
                    {formatCurrency(row.totalBudget)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right tabular-nums border-r border-gray-200">
                    {formatCurrency(row.totalRealisasi)}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-right tabular-nums font-medium border-r border-gray-200 ${remainingClass}`}
                  >
                    {formatCurrency(row.remaining)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ActionCell
                      onDetail={() => onDetail(row)}
                      onInput={() => onInput(row)}
                      onEdit={() => onEdit(row)}
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
