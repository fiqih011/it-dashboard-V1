"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export type DistributionChartData = {
  budgetId: string;
  component: string;
  totalBudget: number;
  realisasi: number;
  percentage: number;
};

type Props = {
  data: DistributionChartData[] | null;
  coa: string;
  loading?: boolean;
  error?: string | null;
};

export default function OpexDistributionChart({
  data,
  coa,
  loading = false,
  error = null,
}: Props) {
  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">
            Distribusi Pemakaian Budget — COA {coa}
          </h3>
        </div>
        <div className="p-6">
          <LoadingState />
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================
  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">
            Distribusi Pemakaian Budget — COA {coa}
          </h3>
        </div>
        <div className="p-6">
          <ErrorState message={error} />
        </div>
      </div>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">
            Distribusi Pemakaian Budget — COA {coa}
          </h3>
        </div>
        <div className="p-6">
          <EmptyState
            title="Tidak ada data"
            description="Tidak ada distribusi budget untuk COA ini"
          />
        </div>
      </div>
    );
  }

  // =====================================================
  // HELPERS
  // =====================================================
  const formatCurrency = (value: number): string => {
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}M`;
    return `Rp ${(value / 1_000).toFixed(0)}K`;
  };

  // =====================================================
  // 🔥 SORT DATA: Smallest to Largest
  // =====================================================
  const sortedData = [...data].sort((a, b) => a.realisasi - b.realisasi);

  // =====================================================
  // 🎨 DYNAMIC COLORS based on usage percentage
  // =====================================================
  const getBarColor = (percentage: number): string => {
    if (percentage >= 100) return "#EF4444"; // Red - Over Budget
    if (percentage >= 80) return "#F59E0B";  // Amber - Warning
    return "#10B981";                         // Green - On Track
  };

  // Prepare chart data
  const categories = sortedData.map((d) => d.budgetId);
  const realisasiData = sortedData.map((d) => d.realisasi);
  const colors = sortedData.map((d) => getBarColor(d.percentage));

  // =====================================================
  // CHART OPTIONS — HORIZONTAL BARS (FIXED)
  // =====================================================
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 500,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "70%",
        distributed: true,
      },
    },
    colors: colors,
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        // Show percentage usage - clean and informative
        return `${sortedData[opts.dataPointIndex].percentage.toFixed(1)}%`;
      },
      style: {
        fontSize: "12px",
        fontWeight: 700,
        colors: ["#fff"],
      },
      offsetX: 0,
    },
    xaxis: {
      labels: {
        formatter: function (val) {
          return formatCurrency(Number(val));
        },
        style: {
          fontSize: "11px",
          colors: "#6B7280",
        },
      },
      axisBorder: {
        show: true,
        color: "#E5E7EB",
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
          colors: "#374151",
        },
      },
    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const item = sortedData[dataPointIndex];
        const usageColor = getBarColor(item.percentage);
        const statusText =
          item.percentage >= 100
            ? "🔴 Over Budget"
            : item.percentage >= 80
            ? "🟡 Warning"
            : "🟢 On Track";

        return `
          <div style="
            padding: 16px;
            background: #1f2937;
            color: white;
            border-radius: 8px;
            min-width: 280px;
          ">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 6px;">
              ${item.component}
            </div>
            <div style="font-size: 12px; color: #9ca3af; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #374151;">
              ${item.budgetId}
            </div>
            <div style="font-size: 13px; line-height: 1.8;">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="color:#9ca3af;">Total Budget</span>
                <span style="font-weight: 600;">${formatCurrency(item.totalBudget)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="color:#9ca3af;">Realisasi</span>
                <strong style="color:${usageColor};">${formatCurrency(item.realisasi)}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="color:#9ca3af;">Sisa Budget</span>
                <span style="font-weight: 600;">${formatCurrency(item.totalBudget - item.realisasi)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid #374151;">
                <span style="color:#9ca3af;">Usage</span>
                <strong style="color:${usageColor};font-size:15px;font-weight:700;">${item.percentage.toFixed(1)}%</strong>
              </div>
              <div style="
                margin-top:12px;
                padding:8px 12px;
                background:rgba(${
                  item.percentage >= 100
                    ? "239, 68, 68"
                    : item.percentage >= 80
                    ? "245, 158, 11"
                    : "16, 185, 129"
                }, 0.25);
                border-radius:6px;
                text-align:center;
              ">
                <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">
                  ${statusText}
                </span>
              </div>
            </div>
          </div>
        `;
      },
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 3,
    },
  };

  const series = [
    {
      name: "Realisasi",
      data: sortedData.map((item) => ({
        x: item.budgetId,  // Budget ID as category
        y: item.realisasi, // Value
      })),
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">
          Distribusi Pemakaian Budget — COA {coa}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {sortedData.length} komponen diurutkan dari terkecil ke terbesar
        </p>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ApexChart options={options} series={series} type="bar" height={500} />
      </div>

      {/* Status Legend */}
      <div className="px-6 pb-4 flex items-center gap-6 text-xs flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-500"></div>
          <span className="text-gray-600">🟢 On Track (&lt;80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
          <span className="text-gray-600">🟡 Warning (80-99%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500"></div>
          <span className="text-gray-600">🔴 Over Budget (≥100%)</span>
        </div>
      </div>

      {/* Info Note */}
      <div className="px-6 pb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="text-blue-500 text-sm mt-0.5">ℹ️</div>
            <div className="text-xs text-blue-800">
              <strong>Catatan:</strong> Chart menampilkan semua komponen dalam COA ini, diurutkan dari realisasi terkecil
              ke terbesar (bawah ke atas). Warna bar menunjukkan status budget
              secara otomatis. Hover pada bar untuk melihat detail lengkap.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}