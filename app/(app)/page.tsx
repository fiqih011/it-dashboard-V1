"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, CheckCircle } from "lucide-react";

import SummaryCard from "@/components/ui/SummaryCard";
import BudgetUsageTable from "@/components/dashboard/BudgetUsageTable";
import StatusLegend from "@/components/ui/StatusLegend";
import type { BudgetUsageItem } from "@/components/dashboard/BudgetUsageTable";

export default function DashboardOpexPage() {
  const [data, setData] = useState<BudgetUsageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const res = await fetch("/api/dashboard/opex");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  const totalBudget = data.reduce((a, b) => a + b.totalBudget, 0);
  const totalUsed = data.reduce((a, b) => a + b.used, 0);
  const remaining = data.reduce((a, b) => a + b.remaining, 0);

  const percent =
    totalBudget > 0
      ? ((totalUsed / totalBudget) * 100).toFixed(1)
      : "0.0";

  const format = (v: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(v);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard OPEX
        </h1>
        <p className="text-gray-600">
          Ringkasan penggunaan budget operasional
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Budget"
          value={format(totalBudget)}
          badge="100%"
          color="blue"
          icon={<DollarSign className="w-5 h-5" />}
          loading={loading}
        />
        <SummaryCard
          title="Total Realisasi"
          value={format(totalUsed)}
          badge={`${percent}%`}
          color="indigo"
          icon={<TrendingUp className="w-5 h-5" />}
          loading={loading}
        />
        <SummaryCard
          title="Remaining Budget"
          value={format(remaining)}
          badge={`${(100 - Number(percent)).toFixed(1)}%`}
          color="emerald"
          icon={<CheckCircle className="w-5 h-5" />}
          loading={loading}
        />
      </div>

      <BudgetUsageTable
        data={data}
        loading={loading}
        onRefresh={fetchData}
      />

      <StatusLegend />
    </div>
  );
}
