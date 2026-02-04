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

  const categories = data.map((d) => d.budgetId);

  // =====================================================
  // CHART OPTIONS — MIXED (BAR + LINE)
  // =====================================================
  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 450,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    colors: ["#3B82F6", "#10B981"],
    stroke: {
      width: [0, 3],
      curve: "smooth",
    },
    series: [
      {
        name: "Realisasi",
        type: "bar",
        data: data.map((d) => d.realisasi),
      },
      {
        name: "Usage %",
        type: "line",
        data: data.map((d) => d.percentage),
      },
    ],
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: [
      {
        title: {
          text: "Realisasi (Rp)",
        },
        labels: {
          formatter: (val) => formatCurrency(Number(val)),
        },
      },
      {
        opposite: true,
        title: {
          text: "Usage (%)",
        },
        labels: {
          formatter: (val) => `${Number(val).toFixed(0)}%`,
        },
        min: 0,
        max: 110,
      },
    ],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
      formatter: (_, opts) =>
        `${data[opts.dataPointIndex].percentage.toFixed(1)}%`,
    },

    // =====================================================
    // 🔥 CUSTOM TOOLTIP — COMPONENT NAME (PROFESSIONAL)
    // =====================================================
    tooltip: {
      shared: true,
      intersect: false,
      custom: ({ dataPointIndex }) => {
        const item = data[dataPointIndex];

        return `
          <div style="
            padding: 12px;
            background: #1f2937;
            color: white;
            border-radius: 8px;
            min-width: 260px;
          ">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px;">
              ${item.component}
            </div>
            <div style="font-size: 12px; color: #9ca3af; margin-bottom: 10px;">
              ${item.budgetId}
            </div>

            <div style="font-size: 13px; line-height: 1.7;">
              <div style="display:flex;justify-content:space-between;">
                <span>Realisasi</span>
                <strong>${formatCurrency(item.realisasi)}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span>Total Budget</span>
                <span>${formatCurrency(item.totalBudget)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-top:6px;border-top:1px solid #374151;padding-top:6px;">
                <span>Usage</span>
                <strong>${item.percentage.toFixed(1)}%</strong>
              </div>
            </div>
          </div>
        `;
      },
    },

    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">
          Distribusi Pemakaian Budget — COA {coa}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Top {data.length} komponen dengan pemakaian terbesar
        </p>
      </div>

      <div className="p-6">
        <ApexChart
          options={options}
          series={options.series!}
          height={450}
        />
      </div>
    </div>
  );
}
