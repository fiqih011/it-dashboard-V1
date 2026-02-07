"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import StatusLegend from "@/components/ui/StatusLegend";

import BudgetUsageTableCapex from "@/components/dashboard/BudgetUsageTableCapex";
import type { BudgetUsageItemCapex } from "@/components/dashboard/BudgetUsageTableCapex";

import TransactionDetailModalCapex from "@/components/modal/TransactionDetailCapexModal";
import DashboardCapexFilter, {
  type DashboardCapexFilterValue,
  type DashboardCapexFilterOptions,
} from "@/components/filter/dashboard/DashboardCapexFilter";

import CapexChartsGrid from "@/components/dashboard/capex/CapexChartsGrid";
import CapexGlobalSummary from "@/components/dashboard/capex/CapexGlobalSummary";
import type { DistributionChartData } from "@/components/dashboard/capex/CapexDistributionChart";
import type { BudgetStatusData } from "@/components/dashboard/capex/CapexStatusDonutChart";

export default function DashboardCapexPage() {
  const router = useRouter();

  // =====================================================
  // FILTER STATE
  // =====================================================
  const [filterDraft, setFilterDraft] = useState<DashboardCapexFilterValue>({
    year: "",
    budgetId: "",
    itemCode: "",
    itemDescription: "",
    noCapex: "",
    itemRemark: "",
  });

  const [filterApplied, setFilterApplied] =
    useState<DashboardCapexFilterValue>(filterDraft);

  const [filterOptions, setFilterOptions] =
    useState<DashboardCapexFilterOptions>({
      years: [],
      budgetIds: [],
      itemCodes: [],
      itemDescriptions: [],
      noCapexList: [],
      itemRemarks: [],
    });

  // =====================================================
  // DATA STATE
  // =====================================================
  const [tableData, setTableData] = useState<BudgetUsageItemCapex[]>([]);

  const [distributionData, setDistributionData] =
    useState<DistributionChartData[]>([]);
  const [statusData, setStatusData] =
    useState<BudgetStatusData | null>(null);

  // =====================================================
  // LOADING
  // =====================================================
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(false);

  const [errorCharts, setErrorCharts] = useState<string | null>(null);

  // =====================================================
  // MODAL
  // =====================================================
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState("");

  // =====================================================
  // INITIAL LOAD
  // =====================================================
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = async () => {
    const res = await fetch("/api/dashboard/capex/years");
    if (!res.ok) return;

    const yearsRaw: number[] = await res.json();
    if (yearsRaw.length === 0) return;

    const years = yearsRaw.map(String);
    const defaultYear = years[0];

    setFilterOptions((prev) => ({ ...prev, years }));
    setFilterDraft((prev) => ({ ...prev, year: defaultYear }));
    setFilterApplied((prev) => ({ ...prev, year: defaultYear }));

    // 🔑 PENTING: build options DARI YEAR (BUKAN dari table hasil filter)
    await rebuildFilterOptionsByYear(defaultYear);

    fetchTableData({
      year: defaultYear,
      budgetId: "",
      itemCode: "",
      itemDescription: "",
      noCapex: "",
      itemRemark: "",
    });
  };

  // =====================================================
  // REBUILD FILTER OPTIONS BY YEAR (CONTEK OPEX)
  // =====================================================
  const rebuildFilterOptionsByYear = async (year: string) => {
    try {
      const res = await fetch(
        `/api/dashboard/capex/tabel-budget?year=${year}`
      );
      if (!res.ok) throw new Error();

      const data: BudgetUsageItemCapex[] = await res.json();

      setFilterOptions((prev) => ({
        ...prev,
        budgetIds: [...new Set(data.map((d) => d.budgetId))].sort(),
        itemCodes: [
          ...new Set(data.map((d) => d.itemCode).filter(Boolean)),
        ].sort(),
        itemDescriptions: [
          ...new Set(data.map((d) => d.itemDescription).filter(Boolean)),
        ].sort(),
        noCapexList: [
          ...new Set(data.map((d) => d.noCapex).filter(Boolean)),
        ].sort(),
        itemRemarks: [
          ...new Set(data.map((d) => d.itemRemark).filter(Boolean)),
        ].sort(),
      }));
    } catch {
      // silent (sama seperti OPEX)
    }
  };

  // =====================================================
  // FETCH TABLE DATA (SOURCE OF TRUTH)
  // =====================================================
  const fetchTableData = async (filters: DashboardCapexFilterValue) => {
    setLoadingTable(true);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.append(k, v);
      });

      const res = await fetch(
        `/api/dashboard/capex/tabel-budget?${params.toString()}`
      );
      if (!res.ok) throw new Error();

      const data: BudgetUsageItemCapex[] = await res.json();
      setTableData(data);
    } finally {
      setLoadingTable(false);
    }
  };

  // =====================================================
  // FETCH CHARTS
  // =====================================================
  const fetchChartsData = async (noCapex: string, year: string) => {
    setLoadingCharts(true);
    setErrorCharts(null);

    try {
      const res = await fetch(
        `/api/dashboard/capex/charts/${encodeURIComponent(noCapex)}?year=${year}`
      );
      if (!res.ok) throw new Error();

      const data = await res.json();
      setDistributionData(data.distributionData || []);
      setStatusData(data.statusData || null);
    } catch {
      setErrorCharts("Gagal mengambil data charts");
      setDistributionData([]);
      setStatusData(null);
    } finally {
      setLoadingCharts(false);
    }
  };

  // =====================================================
  // HANDLERS (COPY OPEX BEHAVIOR)
  // =====================================================
  const handleFilterChange = async (next: DashboardCapexFilterValue) => {
    if (next.year !== filterDraft.year && next.year) {
      const reset: DashboardCapexFilterValue = {
        year: next.year,
        budgetId: "",
        itemCode: "",
        itemDescription: "",
        noCapex: "",
        itemRemark: "",
      };

      setFilterDraft(reset);
      await rebuildFilterOptionsByYear(next.year);
    } else {
      setFilterDraft(next);
    }
  };

  const handleSearch = () => {
    if (!filterDraft.year) return;

    setFilterApplied(filterDraft);
    fetchTableData(filterDraft);

    if (filterDraft.noCapex) {
      fetchChartsData(filterDraft.noCapex, filterDraft.year);
    } else {
      setDistributionData([]);
      setStatusData(null);
    }
  };

  const handleReset = async () => {
    await init();
    setDistributionData([]);
    setStatusData(null);
  };

  const handleViewDetails = (id: string) => {
    setSelectedBudgetId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBudgetId("");
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard Menu</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-800">Dashboard CAPEX</h1>
        <p className="text-gray-600 mt-1">
          Ringkasan penggunaan budget capital expenditure
        </p>
      </div>

      <DashboardCapexFilter
        value={filterDraft}
        options={filterOptions}
        onChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* ✅ GLOBAL SUMMARY — SOURCE = TABLE */}
      <CapexGlobalSummary data={tableData} loading={loadingTable} />

      {filterApplied.noCapex && (
        <CapexChartsGrid
          noCapex={filterApplied.noCapex}
          distributionData={distributionData}
          statusData={statusData}
          loading={loadingCharts}
          error={errorCharts}
        />
      )}

      <BudgetUsageTableCapex
        data={tableData}
        loading={loadingTable}
        onRefresh={() => fetchTableData(filterApplied)}
        onViewDetails={handleViewDetails}
      />

      <StatusLegend />

      <TransactionDetailModalCapex
        open={modalOpen}
        budgetId={selectedBudgetId}
        onClose={handleCloseModal}
      />
    </div>
  );
}
