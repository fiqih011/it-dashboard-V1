"use client";

import React from "react";
import CapexStatusDonutChart from "./CapexStatusDonutChart";
import CapexDistributionChart from "./CapexDistributionChart";
import type { BudgetStatusData } from "./CapexStatusDonutChart";
import type { DistributionChartData } from "./CapexDistributionChart";

type Props = {
  noCapex: string;
  distributionData: DistributionChartData[] | null;
  statusData: BudgetStatusData | null;
  loading?: boolean;
  error?: string | null;
};

export default function CapexChartsGrid({
  noCapex,
  distributionData,
  statusData,
  loading = false,
  error = null,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Status Donut Chart (1/3 width) */}
      <div className="lg:col-span-1">
        <CapexStatusDonutChart
          data={statusData}
          noCapex={noCapex}
          loading={loading}
          error={error}
        />
      </div>

      {/* Right: Distribution Bar Chart (2/3 width) */}
      <div className="lg:col-span-2">
        <CapexDistributionChart
          data={distributionData}
          noCapex={noCapex}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}