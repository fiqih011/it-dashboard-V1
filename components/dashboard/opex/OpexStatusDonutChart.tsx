"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export type BudgetStatusData = {
  onTrack: number;
  warning: number;
  overBudget: number;
  total: number;
};

type Props = {
  data: BudgetStatusData | null;
  coa: string;
  loading?: boolean;
  error?: string | null;
};

export default function OpexStatusDonutChart({
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
            Status Budget — COA {coa}
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
            Status Budget — COA {coa}
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
  if (!data || data.total === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">
            Status Budget — COA {coa}
          </h3>
        </div>
        <div className="p-6">
          <EmptyState
            title="Tidak ada data"
            description="Tidak ada status budget untuk COA ini"
          />
        </div>
      </div>
    );
  }

  // =====================================================
  // CHART OPTIONS
  // =====================================================
  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 320,
    },
    series: [data.onTrack, data.warning, data.overBudget],
    labels: ["On Track (<80%)", "Warning (80-99%)", "Over Budget (≥100%)"],
    colors: ["#10B981", "#F59E0B", "#EF4444"],
    legend: {
      position: "bottom",
      fontSize: "13px",
      fontWeight: 500,
      offsetY: 8,
      itemMargin: {
        vertical: 4,
      },
      markers: {
        size: 12,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        // Show count instead of percentage
        return opts.w.config.series[opts.seriesIndex].toString();
      },
      style: {
        fontSize: "16px",
        fontWeight: 700,
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
              color: "#6B7280",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "32px",
              fontWeight: 700,
              color: "#111827",
              offsetY: 8,
              formatter: (val) => val.toString(),
            },
            total: {
              show: true,
              label: "Total Budgets",
              fontSize: "14px",
              fontWeight: 600,
              color: "#6B7280",
              formatter: () => data.total.toString(),
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} komponen`,
      },
      style: {
        fontSize: "13px",
      },
    },
    states: {
      hover: {
        filter: {
          type: "lighten",
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
  };

  // Calculate percentages for stats
  const onTrackPercent = ((data.onTrack / data.total) * 100).toFixed(1);
  const warningPercent = ((data.warning / data.total) * 100).toFixed(1);
  const overBudgetPercent = ((data.overBudget / data.total) * 100).toFixed(1);

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">
          Status Budget — COA {coa}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Breakdown status {data.total} komponen
        </p>
      </div>

      {/* Chart */}
      <div className="p-6 flex-1">
        <ApexChart
          options={options}
          series={options.series!}
          type="donut"
          height={320}
        />
      </div>

      {/* Stats Summary */}
      <div className="px-6 pb-6 space-y-3">
        {/* On Track */}
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700">
              On Track
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-700">
              {data.onTrack}
            </div>
            <div className="text-xs text-green-600">{onTrackPercent}%</div>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
            <span className="text-sm font-medium text-gray-700">Warning</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-amber-700">
              {data.warning}
            </div>
            <div className="text-xs text-amber-600">{warningPercent}%</div>
          </div>
        </div>

        {/* Over Budget */}
        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-red-500"></div>
            <span className="text-sm font-medium text-gray-700">
              Over Budget
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-red-700">
              {data.overBudget}
            </div>
            <div className="text-xs text-red-600">{overBudgetPercent}%</div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="px-6 pb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="text-blue-500 text-sm mt-0.5">ℹ️</div>
            <div className="text-xs text-blue-800">
              <strong>Catatan:</strong> Status otomatis berdasarkan percentage
              usage. On Track &lt;80%, Warning 80-99%, Over Budget ≥100%.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}