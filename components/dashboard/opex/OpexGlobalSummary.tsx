"use client";

import { DollarSign, TrendingUp, CheckCircle } from "lucide-react";
import SummaryCard from "@/components/ui/SummaryCard";
import type { BudgetUsageItem } from "@/components/dashboard/BudgetUsageTable";

interface OpexGlobalSummaryProps {
  data: BudgetUsageItem[];
  loading: boolean;
}

export default function OpexGlobalSummary({
  data,
  loading,
}: OpexGlobalSummaryProps) {
  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================
  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          icon={<DollarSign className="w-6 h-6" />}
          title="Total Budget"
          value="Rp 0"
          badge="0%"
          color="blue"
          loading={false}
        />
        <SummaryCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Total Realisasi"
          value="Rp 0"
          badge="0%"
          color="purple"
          loading={false}
        />
        <SummaryCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Remaining Budget"
          value="Rp 0"
          badge="0%"
          color="emerald"
          loading={false}
        />
      </div>
    );
  }

  // =====================================================
  // CALCULATION (SOURCE OF TRUTH = TABLE)
  // =====================================================
  const totalBudget = data.reduce(
    (sum, d) => sum + d.totalBudget,
    0
  );

  const totalRealisasi = data.reduce(
    (sum, d) => sum + d.used,
    0
  );

  const totalRemaining = data.reduce(
    (sum, d) => sum + d.remaining,
    0
  );

  const percentage =
    totalBudget > 0 ? (totalRealisasi / totalBudget) * 100 : 0;

  const remainingPercentage = (100 - percentage).toFixed(1);

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          icon={<DollarSign className="w-6 h-6" />}
          title="Total Budget"
          value={formatCurrency(totalBudget)}
          badge="100%"
          color="blue"
          loading={false}
        />

        <SummaryCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Total Realisasi"
          value={formatCurrency(totalRealisasi)}
          badge={`${percentage.toFixed(1)}%`}
          color="purple"
          loading={false}
        />

        <SummaryCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Remaining Budget"
          value={formatCurrency(totalRemaining)}
          badge={`${remainingPercentage}%`}
          color="emerald"
          loading={false}
        />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Total OPEX – {data.length} Budget Plan
        </p>
      </div>
    </div>
  );
}
