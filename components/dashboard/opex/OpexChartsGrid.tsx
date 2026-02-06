"use client";

import React from "react";
import OpexStatusDonutChart, {
  BudgetStatusData,
} from "./OpexStatusDonutChart";
import OpexDistributionChart, {
  DistributionChartData,
} from "./OpexDistributionChart";

type Props = {
  coa: string;
  distributionData: DistributionChartData[] | null;
  statusData: BudgetStatusData | null;
  loading?: boolean;
  error?: string | null;
};

export default function OpexChartsGrid({
  coa,
  distributionData,
  statusData,
  loading = false,
  error = null,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Donut Chart (1 column) */}
      <div className="lg:col-span-1">
        <OpexStatusDonutChart
          data={statusData}
          coa={coa}
          loading={loading}
          error={error}
        />
      </div>

      {/* Right: Distribution Bars (2 columns) */}
      <div className="lg:col-span-2">
        <OpexDistributionChart
          data={distributionData}
          coa={coa}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}