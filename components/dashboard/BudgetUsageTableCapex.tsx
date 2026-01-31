"use client";

import { AlertCircle, CheckCircle, MinusCircle, TrendingUp, RefreshCw, Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";

export type BudgetUsageItemCapex = {
  budgetId: string;
  budgetInternalId: string; // ✅ ID internal untuk API call
  itemCode: string;
  itemDescription: string;
  noCapex: string | null;
  totalBudget: number;
  used: number;
  remaining: number;
  percentage: number;
};

type Props = {
  data: BudgetUsageItemCapex[];
  loading?: boolean;
  onRefresh?: () => void;
  onViewDetails?: (budgetInternalId: string) => void;
};

type SortField = 'budgetId' | 'itemCode' | 'itemDescription' | 'noCapex' | 'totalBudget' | 'used' | 'remaining' | 'percentage';
type SortDirection = 'asc' | 'desc' | null;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * =====================================================
 * PROGRESS BAR COLOR (STRICT STANDARD)
 * =====================================================
 */
function getProgressBarColor(percentage: number): string {
  if (percentage > 100) return "bg-red-500";
  if (percentage === 100) return "bg-amber-500";
  if (percentage >= 80) return "bg-yellow-400";
  return "bg-green-500";
}

/**
 * =====================================================
 * STATUS BADGE COLOR (STRICT STANDARD)
 * =====================================================
 */
function getStatusBadgeClasses(percentage: number): string {
  if (percentage === 0) {
    return "bg-slate-100 text-slate-500 border border-slate-300";
  }
  if (percentage > 100) {
    return "bg-red-50 text-red-700 border border-red-300";
  }
  if (percentage === 100) {
    return "bg-amber-50 text-amber-700 border border-amber-300";
  }
  return "bg-green-50 text-green-700 border border-green-300";
}

function getStatusIcon(percentage: number) {
  if (percentage === 0) return <MinusCircle className="w-4 h-4" />;
  if (percentage > 100) return <AlertCircle className="w-4 h-4" />;
  if (percentage === 100) return <TrendingUp className="w-4 h-4" />;
  return <CheckCircle className="w-4 h-4" />;
}

function getStatusText(percentage: number): string {
  if (percentage === 0) return "Not Used";
  if (percentage > 100) return "Over Budget";
  if (percentage === 100) return "On Budget";
  return "Under Budget";
}

function getRemainingTextColor(value: number): string {
  if (value < 0) return "text-red-500";
  if (value === 0) return "text-amber-500";
  return "text-gray-900";
}

export default function BudgetUsageTableCapex({
  data,
  loading = false,
  onRefresh,
  onViewDetails,
}: Props) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    // Handle null values for noCapex
    if (sortField === 'noCapex') {
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sortDirection === 'asc' ? 1 : -1;
      if (bVal === null) return sortDirection === 'asc' ? -1 : 1;
    }

    // For string comparison
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3.5 h-3.5 text-blue-600" />;
    }
    return <ArrowDown className="w-3.5 h-3.5 text-blue-600" />;
  };

  const summary = {
    totalBudget: data.reduce((acc, item) => acc + item.totalBudget, 0),
    totalUsed: data.reduce((acc, item) => acc + item.used, 0),
    totalRemaining: data.reduce((acc, item) => acc + item.remaining, 0),
  };

  const overallPercentage =
    summary.totalBudget > 0
      ? ((summary.totalUsed / summary.totalBudget) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* HEADER */}
      <div className="bg-slate-50 px-6 py-5 border-b-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Budget Usage Details
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Rincian penggunaan budget per item CAPEX
            </p>
          </div>
          {onRefresh && (
            <Button
              variant="secondary"
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          )}
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "600px" }}>
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr className="border-b-2 border-gray-200">
              <th 
                className="px-5 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('budgetId')}
              >
                <div className="flex items-center gap-2">
                  <span>Budget ID</span>
                  {renderSortIcon('budgetId')}
                </div>
              </th>
              <th 
                className="px-5 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('itemCode')}
              >
                <div className="flex items-center gap-2">
                  <span>Item Code</span>
                  {renderSortIcon('itemCode')}
                </div>
              </th>
              <th 
                className="px-5 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('itemDescription')}
              >
                <div className="flex items-center gap-2">
                  <span>Item Description</span>
                  {renderSortIcon('itemDescription')}
                </div>
              </th>
              <th 
                className="px-5 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('noCapex')}
              >
                <div className="flex items-center gap-2">
                  <span>No CAPEX</span>
                  {renderSortIcon('noCapex')}
                </div>
              </th>
              <th 
                className="px-5 py-4 text-right text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('totalBudget')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Total Budget</span>
                  {renderSortIcon('totalBudget')}
                </div>
              </th>
              <th 
                className="px-5 py-4 text-right text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('used')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Realisasi</span>
                  {renderSortIcon('used')}
                </div>
              </th>
              <th 
                className="px-5 py-4 text-right text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('remaining')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Remaining</span>
                  {renderSortIcon('remaining')}
                </div>
              </th>
              <th 
                className="px-5 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('percentage')}
              >
                <div className="flex items-center gap-2">
                  <span>Progress</span>
                  {renderSortIcon('percentage')}
                </div>
              </th>
              <th className="px-5 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                Status
              </th>
              <th className="px-5 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                    <span className="text-gray-500 font-medium">Memuat data...</span>
                  </div>
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                  Tidak ada data budget
                </td>
              </tr>
            )}

            {!loading &&
              sortedData.map((item, index) => {
                const progressWidth = Math.min(item.percentage, 100);
                
                return (
                  <tr
                    key={item.budgetId}
                    className={`
                      border-b border-gray-200
                      hover:bg-slate-50 transition-colors
                      ${index % 2 === 0 ? "bg-white" : "bg-slate-100"}
                    `}
                  >
                    {/* BUDGET ID */}
                    <td className="px-5 py-4 border-r border-gray-200">
                      <span className="text-sm font-semibold text-gray-900 font-mono">
                        {item.budgetId}
                      </span>
                    </td>

                    {/* ITEM CODE */}
                    <td className="px-5 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">
                        {item.itemCode}
                      </span>
                    </td>

                    {/* ITEM DESCRIPTION */}
                    <td className="px-5 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">
                        {item.itemDescription}
                      </span>
                    </td>

                    {/* NO CAPEX */}
                    <td className="px-5 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">
                        {item.noCapex || "-"}
                      </span>
                    </td>

                    {/* TOTAL BUDGET */}
                    <td className="px-5 py-4 text-right border-r border-gray-200">
                      <span className="text-sm font-semibold text-gray-900 tabular-nums">
                        {formatCurrency(item.totalBudget)}
                      </span>
                    </td>

                    {/* REALISASI */}
                    <td className="px-5 py-4 text-right border-r border-gray-200">
                      <span className="text-sm font-semibold text-gray-900 tabular-nums">
                        {formatCurrency(item.used)}
                      </span>
                    </td>

                    {/* REMAINING */}
                    <td className="px-5 py-4 text-right border-r border-gray-200">
                      <span className={`text-sm font-semibold tabular-nums ${getRemainingTextColor(item.remaining)}`}>
                        {formatCurrency(item.remaining)}
                      </span>
                    </td>

                    {/* PROGRESS BAR */}
                    <td className="px-5 py-4 border-r border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden min-w-[140px]">
                          <div
                            className={`h-full transition-all duration-500 ${getProgressBarColor(
                              item.percentage
                            )}`}
                            style={{
                              width: `${progressWidth}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 tabular-nums min-w-[3.5rem] text-right">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* STATUS BADGE */}
                    <td className="px-5 py-4 text-center border-r border-gray-200">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusBadgeClasses(
                          item.percentage
                        )}`}
                      >
                        {getStatusIcon(item.percentage)}
                        {getStatusText(item.percentage)}
                      </span>
                    </td>

                    {/* ACTION - VIEW DETAILS */}
                    <td className="px-5 py-4 text-center">
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(item.budgetInternalId)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-300 shadow-sm hover:shadow"
                          title="View transaction details"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-xs font-semibold">View</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* FOOTER SUMMARY */}
      {!loading && data.length > 0 && (
        <div className="bg-slate-50 px-6 py-5 border-t-2 border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">
              Total{" "}
              <span className="font-bold text-gray-900 text-lg mx-1">
                {data.length}
              </span>
              item budget
            </span>
            <span className="text-gray-700 font-medium">
              Overall usage:{" "}
              <span className="font-bold text-gray-900 text-xl ml-2">
                {overallPercentage}%
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}