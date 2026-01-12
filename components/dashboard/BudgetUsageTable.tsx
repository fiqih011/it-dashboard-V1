"use client";

import { AlertCircle, CheckCircle, MinusCircle, TrendingUp } from "lucide-react";
import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

export type BudgetUsageItem = {
  budgetId: string;
  name: string;
  totalBudget: number;
  used: number;
  remaining: number;
  percentage: number;
};

type Props = {
  data: BudgetUsageItem[];
  loading?: boolean;
  onRefresh?: () => void;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

/* ===== STATUS LOGIC (TIDAK DIUBAH) ===== */
function getStatusColor(percentage: number): string {
  if (percentage === 0) return "bg-gray-400";
  if (percentage > 100) return "bg-red-500";
  if (percentage === 100) return "bg-yellow-500";
  return "bg-green-500";
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
/* ===================================== */

export default function BudgetUsageTable({
  data,
  loading = false,
  onRefresh,
}: Props) {
  const overallPercentage =
    data.length > 0
      ? (
          (data.reduce((a, b) => a + b.used, 0) /
            data.reduce((a, b) => a + b.totalBudget, 0)) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* ===== HEADER (LIGHT & PROFESSIONAL) ===== */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Budget Usage Details
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              Rincian penggunaan budget per komponen OPEX
            </p>
          </div>

          {onRefresh && (
            <Button
              variant="secondary"
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-white hover:bg-blue-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto max-h-[600px]">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="border-b border-gray-300">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase">
                Budget ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase">
                Komponen
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase">
                Total Budget
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase bg-purple-600 text-white">
                Realisasi
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase bg-green-600 text-white">
                Remaining
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase">
                Progress
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              data.map((item, idx) => {
                const progressWidth = Math.min(item.percentage, 100);

                return (
                  <tr
                    key={item.budgetId}
                    className={`border-b hover:bg-blue-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {item.budgetId}
                    </td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(item.totalBudget)}
                    </td>
                    <td className="px-4 py-3 text-right bg-purple-50 text-purple-700 font-semibold">
                      {formatCurrency(item.used)}
                    </td>
                    <td className="px-4 py-3 text-right bg-green-50 text-green-700 font-semibold">
                      {formatCurrency(item.remaining)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-full ${getStatusColor(
                              item.percentage
                            )}`}
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-bold ${getStatusColor(
                          item.percentage
                        )}`}
                      >
                        {getStatusIcon(item.percentage)}
                        {getStatusText(item.percentage)}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* ===== FOOTER (SOFT BLUE) ===== */}
      {!loading && data.length > 0 && (
        <div className="bg-blue-50 px-6 py-4 border-t border-blue-200 flex justify-between text-sm">
          <span className="text-blue-700 font-medium">
            Total <strong>{data.length}</strong> komponen
          </span>
          <span className="text-blue-700 font-medium">
            Overall usage:{" "}
            <strong className="text-blue-900">
              {overallPercentage}%
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}
