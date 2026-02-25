"use client";

import { DollarSign, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import SummaryCard from "@/components/ui/SummaryCard";
import type { BudgetUsageItem } from "@/components/dashboard/BudgetUsageTable";

interface OpexGlobalSummaryProps {
  data: BudgetUsageItem[];
  loading: boolean;
}

const fmt = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export default function OpexGlobalSummary({ data, loading }: OpexGlobalSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SummaryCard key={i} icon={<DollarSign className="w-5 h-5" />} title="" value="" loading={true} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard icon={<BarChart3 className="w-5 h-5" />} title="Budget Plans" value="0" badge="entries" color="indigo" />
        <SummaryCard icon={<DollarSign className="w-5 h-5" />} title="Total Budget" value="Rp 0" badge="0%" color="blue" />
        <SummaryCard icon={<TrendingUp className="w-5 h-5" />} title="Total Realization" value="Rp 0" badge="0%" color="orange" />
        <SummaryCard icon={<Wallet className="w-5 h-5" />} title="Remaining Budget" value="Rp 0" badge="0%" color="emerald" />
      </div>
    );
  }

  const totalBudget = data.reduce((sum, d) => sum + d.totalBudget, 0);
  const totalRealization = data.reduce((sum, d) => sum + d.used, 0);
  const totalRemaining = data.reduce((sum, d) => sum + d.remaining, 0);
  const percentage = totalBudget > 0 ? (totalRealization / totalBudget) * 100 : 0;
  const remainingPct = (100 - percentage).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <SummaryCard
        icon={<BarChart3 className="w-5 h-5" />}
        title="Budget Plans"
        value={String(data.length)}
        sub="Budget plan entries"
        badge="entries"
        color="indigo"
      />
      <SummaryCard
        icon={<DollarSign className="w-5 h-5" />}
        title="Total Budget"
        value={fmt(totalBudget)}
        sub="Planned amount"
        badge="100%"
        color="blue"
      />
      <SummaryCard
        icon={<TrendingUp className="w-5 h-5" />}
        title="Total Realization"
        value={fmt(totalRealization)}
        sub="Realized amount"
        badge={`${percentage.toFixed(1)}%`}
        color="orange"
      />
      <SummaryCard
        icon={<Wallet className="w-5 h-5" />}
        title="Remaining Budget"
        value={fmt(totalRemaining)}
        sub="Available balance"
        badge={`${remainingPct}%`}
        color={totalRemaining < 0 ? "red" : "emerald"}
      />
    </div>
  );
}