"use client";

import { DollarSign, TrendingUp, CheckCircle } from "lucide-react";
import SummaryCard from "@/components/ui/SummaryCard";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import type { DashboardGlobalSummary } from "@/types/dashboard";

interface OpexGlobalSummaryProps {
  data: DashboardGlobalSummary | null;
  loading: boolean;
  error: string | null;
}

export default function OpexGlobalSummary({
  data,
  loading,
  error,
}: OpexGlobalSummaryProps) {
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
  // LOADING STATE
  // =====================================================
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
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
  // NO DATA STATE
  // =====================================================
  if (!data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-center text-gray-500">
          Tidak ada data summary untuk tahun yang dipilih
        </p>
      </div>
    );
  }

  // =====================================================
  // CALCULATE REMAINING PERCENTAGE
  // =====================================================
  const remainingPercentage = (100 - data.percentage).toFixed(1);

  // =====================================================
  // RENDER SUMMARY CARDS
  // =====================================================
  return (
    <div className="space-y-4">
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Budget */}
        <SummaryCard
          icon={<DollarSign className="w-6 h-6" />}
          title="Total Budget"
          value={formatCurrency(data.totalBudget)}
          badge="100%"
          color="blue"
          loading={false}
        />

        {/* Card 2: Total Realisasi */}
        <SummaryCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Total Realisasi"
          value={formatCurrency(data.totalRealisasi)}
          badge={formatPercentage(data.percentage)}
          color="purple"
          loading={false}
        />

        {/* Card 3: Remaining Budget */}
        <SummaryCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Remaining Budget"
          value={formatCurrency(data.totalRemaining)}
          badge={`${remainingPercentage}%`}
          color="emerald"
          loading={false}
        />
      </div>

      {/* Subtext - Context */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Total OPEX – Tahun {data.year} (All COA)
          {data.count > 0 && (
            <span className="ml-2 text-gray-400">
              • {data.count} Budget Plan{data.count > 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}