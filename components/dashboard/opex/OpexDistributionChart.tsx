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
          <ErrorState />
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
  // FORMAT CURRENCY
  // =====================================================
  const formatCurrency = (value: number): string => {
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}M`;
    return `Rp ${(value / 1_000).toFixed(0)}K`;
  };

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
      categories: data.map((d) => d.budgetId),
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
    tooltip: {
      shared: true,
      intersect: false,
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
        <ApexChart options={options} series={options.series!} height={450} />
      </div>
    </div>
  );
}
