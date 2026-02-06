"use client";

import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import type { DashboardCoaSummary } from "@/types/dashboard";

interface OpexCoaSummaryProps {
  data: DashboardCoaSummary | null;
  loading: boolean;
  error: string | null;
}

export default function OpexCoaSummary({
  data,
  loading,
  error,
}: OpexCoaSummaryProps) {
  // =====================================================
  // FORMAT HELPERS
  // =====================================================
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // =====================================================
  // STATUS BADGE CONFIG
  // =====================================================
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "safe":
        return {
          label: "Aman",
          icon: "🟢",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-300",
        };
      case "warning":
        return {
          label: "Warning",
          icon: "🟡",
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-300",
        };
      case "over":
        return {
          label: "Over Budget",
          icon: "🔴",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-300",
        };
      default:
        return {
          label: "Unknown",
          icon: "⚪",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-300",
        };
    }
  };

  // =====================================================
  // LOADING STATE
  // =====================================================
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mt-4"></div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ErrorState message={error} />
      </div>
    );
  }

  // =====================================================
  // NO DATA (Should not render)
  // =====================================================
  if (!data) {
    return null;
  }

  // =====================================================
  // STATUS CONFIG
  // =====================================================
  const statusConfig = getStatusConfig(data.status);

  // =====================================================
  // RENDER COA SUMMARY PANEL
  // =====================================================
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold text-white">
          COA ACCOUNT: {data.coa}
        </h3>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Budget Plan */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Budget Plan</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(data.totalBudget)}
            </p>
          </div>

          {/* Realisasi */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Realisasi</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(data.totalRealisasi)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatPercentage(data.percentage)} terpakai
            </p>
          </div>

          {/* Sisa Budget */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Sisa Budget</p>
            <p
              className={`text-lg font-semibold ${
                data.totalRemaining < 0 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {formatCurrency(data.totalRemaining)}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
            >
              <span>{statusConfig.icon}</span>
              <span>{statusConfig.label}</span>
            </span>
          </div>
        </div>

        {/* Additional Info */}
        {data.count > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {data.count} komponen budget dalam COA ini
            </p>
          </div>
        )}
      </div>
    </div>
  );
}