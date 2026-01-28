"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, CheckCircle } from "lucide-react";

import SummaryCard from "@/components/ui/SummaryCard";
import StatusLegend from "@/components/ui/StatusLegend";
import BudgetUsageTableCapex from "@/components/dashboard/BudgetUsageTableCapex";
import TransactionDetailModalCapex from "@/components/modal/TransactionDetailCapexModal";
import type { BudgetUsageItemCapex } from "@/components/dashboard/BudgetUsageTableCapex";

interface Summary {
  totalBudget: number;
  totalRealisasi: number;
  remaining: number;
}

export default function DashboardCapexPage() {
  const [budgetData, setBudgetData] = useState<BudgetUsageItemCapex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary>({
    totalBudget: 0,
    totalRealisasi: 0,
    remaining: 0,
  });

  // ✅ Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard/capex");

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: BudgetUsageItemCapex[] = await response.json();
      setBudgetData(data);

      // Calculate summary
      const total = data.reduce((acc, item) => acc + item.totalBudget, 0);
      const used = data.reduce((acc, item) => acc + item.used, 0);
      const remaining = data.reduce((acc, item) => acc + item.remaining, 0);

      setSummary({
        totalBudget: total,
        totalRealisasi: used,
        remaining: remaining,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal mengambil data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const usagePercentage =
    summary.totalBudget > 0
      ? ((summary.totalRealisasi / summary.totalBudget) * 100).toFixed(1)
      : "0.0";

  // ✅ Handle view details
  const handleViewDetails = (budgetInternalId: string) => {
    setSelectedBudgetId(budgetInternalId);
    setModalOpen(true);
  };

  // ✅ Handle close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBudgetId("");
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard CAPEX</h1>
        <p className="text-gray-600 mt-1">
          Ringkasan penggunaan budget capital expenditure
        </p>
      </div>

      {/* Summary Cards - AdminLTE Style */}
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
          color="purple"
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

      {/* Budget Usage Table with Action */}
      <BudgetUsageTableCapex
        data={budgetData}
        loading={loading}
        onRefresh={fetchDashboardData}
        onViewDetails={handleViewDetails}
      />

      {/* Status Legend */}
      <StatusLegend />

      {/* Transaction Detail Modal */}
      <TransactionDetailModalCapex
        open={modalOpen}
        budgetId={selectedBudgetId}
        onClose={handleCloseModal}
      />
    </div>
  );
}