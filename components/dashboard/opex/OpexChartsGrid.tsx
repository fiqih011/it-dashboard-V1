"use client";

import React from "react";
import OpexStatusDonutChart, {
  BudgetStatusData,
} from "./OpexStatusDonutChart";
import OpexDistributionChart, {
  DistributionChartData,
} from "./OpexDistributionChart";
import OpexGroupedBarChart, {
  OpexGroupedBarItem,
} from "./OpexGroupedBarChart";

type Props = {
  coa: string;
  distributionData: DistributionChartData[] | null;
  statusData: BudgetStatusData | null;
  groupedBarData?: OpexGroupedBarItem[] | null; // NEW
  loading?: boolean;
  error?: string | null;
};

export default function OpexChartsGrid({
  coa,
  distributionData,
  statusData,
  groupedBarData = null,
  loading = false,
  error = null,
}: Props) {
  // If COA selected → show grouped chart
  if (coa && groupedBarData) {
    return (
      <div className="w-full">
        <OpexGroupedBarChart
          data={groupedBarData}
          coa={coa}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  // Default view → 2 old charts
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <OpexStatusDonutChart
          data={statusData}
          coa={coa}
          loading={loading}
          error={error}
        />
      </div>

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
