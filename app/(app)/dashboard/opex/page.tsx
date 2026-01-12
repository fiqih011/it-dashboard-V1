"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, CheckCircle } from "lucide-react";

import SummaryCard from "@/components/ui/SummaryCard";
import StatusLegend from "@/components/ui/StatusLegend";
import BudgetUsageTable from "@/components/dashboard/BudgetUsageTable";
import type { BudgetUsageItem } from "@/components/dashboard/BudgetUsageTable";

interface Summary {
  totalBudget: number;
  totalRealisasi: number;
  remaining: number;
}

export default function DashboardOpexPage() {
  const [budgetData, setBudgetData] = useState<BudgetUsageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary>({
    totalBudget: 0,
    totalRealisasi: 0,
    remaining: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard/opex");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data: BudgetUsageItem[] = await response.json();
      setBudgetData(data);

      const totalBudget = data.reduce(
        (acc, item) => acc + item.totalBudget,
        0
      );
      const totalRealisasi = data.reduce(
        (acc, item) => acc + item.used,
        0
      );
      const remaining = data.reduce(
        (acc, item) => acc + item.remaining,
        0
      );

      setSummary({
        totalBudget,
        totalRealisasi,
        remaining,
      });
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const usagePercentage =
    summary.totalBudget > 0
      ? ((summary.totalRealisasi / summary.totalBudget) * 100).toFixed(1)
      : "0.0";

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard OPEX
        </h1>
        <p className="text-gray-600 mt-1">
          Ringkasan penggunaan budget operasional
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          icon={<DollarSign className="w-6 h-6" />}
          title="Total Budget"
          value={formatCurrency(summary.totalBudget)}
          badge="100%"
          color="blue"
          loading={loading}
        />

        <SummaryCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Total Realisasi"
          value={formatCurrency(summary.totalRealisasi)}
          badge={`${usagePercentage}%`}
          color="indigo"
          loading={loading}
        />

        <SummaryCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Remaining Budget"
          value={formatCurrency(summary.remaining)}
          badge={`${(100 - parseFloat(usagePercentage)).toFixed(1)}%`}
          color="emerald"
          loading={loading}
        />
      </div>

      {/* ✅ TABEL SAJA */}
      <BudgetUsageTable
        data={budgetData}
        loading={loading}
        onRefresh={fetchDashboardData}
      />

      {/* LEGEND */}
      <StatusLegend />
    </div>
  );
}
