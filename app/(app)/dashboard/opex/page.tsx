"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import StatusLegend from "@/components/ui/StatusLegend";
import BudgetUsageTable from "@/components/dashboard/BudgetUsageTable";
import TransactionDetailModal from "@/components/modal/TransactionDetailModal";
import type { BudgetUsageItem } from "@/components/dashboard/BudgetUsageTable";

import DashboardOpexFilter from "@/components/filter/dashboard/DashboardOpexFilter";
import OpexGlobalSummary from "@/components/dashboard/opex/OpexGlobalSummary";
import OpexChartsGrid from "@/components/dashboard/opex/OpexChartsGrid";
import type { DistributionChartData } from "@/components/dashboard/opex/OpexDistributionChart";
import type { BudgetStatusData } from "@/components/dashboard/opex/OpexStatusDonutChart";

import type {
  DashboardOpexFilterValue,
  DashboardFilterOptions,
  DashboardGlobalSummary,
} from "@/types/dashboard";

export default function DashboardOpexPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear().toString();

  // =====================================================
  // FILTER STATE
  // =====================================================
  const [filterDraft, setFilterDraft] = useState<DashboardOpexFilterValue>({
    year: "",
    budgetId: "",
    coa: "",
    category: "",
    component: "",
  });

  const [filterApplied, setFilterApplied] =
    useState<DashboardOpexFilterValue>(filterDraft);

  const [filterOptions, setFilterOptions] = useState<DashboardFilterOptions>({
    years: [],
    budgetIds: [],
    coas: [],
    categories: [],
    components: [],
  });

  // =====================================================
  // DATA STATE
  // =====================================================
  const [globalSummary, setGlobalSummary] =
    useState<DashboardGlobalSummary | null>(null);

  const [chartDistribution, setChartDistribution] =
    useState<DistributionChartData[]>([]);

  const [chartStatus, setChartStatus] =
    useState<BudgetStatusData | null>(null);

  const [budgetData, setBudgetData] = useState<BudgetUsageItem[]>([]);

  // =====================================================
  // LOADING / ERROR
  // =====================================================
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);

  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [errorCharts, setErrorCharts] = useState<string | null>(null);
  const [errorTable, setErrorTable] = useState<string | null>(null);

  // =====================================================
  // MODAL
  // =====================================================
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");

  // =====================================================
  // INITIAL LOAD
  // =====================================================
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = async () => {
    await fetchAvailableYears();

    setFilterDraft((prev) => ({ ...prev, year: currentYear }));
    setFilterApplied((prev) => ({ ...prev, year: currentYear }));

    await rebuildFilterOptionsByYear(currentYear);

    // 🔒 NORMALIZED COA → ""
    fetchGlobalSummary(currentYear, "");
    fetchTableData({
      year: currentYear,
      budgetId: "",
      coa: "",
      category: "",
      component: "",
    });
  };

  // =====================================================
  // FETCH AVAILABLE YEARS
  // =====================================================
  const fetchAvailableYears = async () => {
    try {
      const res = await fetch("/api/dashboard/opex/years");
      if (!res.ok) throw new Error();

      const years: number[] = await res.json();

      setFilterOptions((prev) => ({
        ...prev,
        years: years.map(String),
      }));
    } catch {
      const y = new Date().getFullYear();
      const fallback = Array.from({ length: 5 }, (_, i) => String(y - i));
      setFilterOptions((prev) => ({ ...prev, years: fallback }));
    }
  };

  // =====================================================
  // REBUILD FILTER OPTIONS BY YEAR
  // =====================================================
  const rebuildFilterOptionsByYear = async (year: string) => {
    try {
      const res = await fetch(
        `/api/dashboard/opex/tabel-budget?year=${year}`
      );
      if (!res.ok) throw new Error();

      const data: BudgetUsageItem[] = await res.json();

      setFilterOptions((prev) => ({
        ...prev,
        budgetIds: [...new Set(data.map((d) => d.budgetId))].sort(),
        coas: [...new Set(data.map((d) => d.coa))].sort(),
        categories: [...new Set(data.map((d) => d.name))].sort(),
        components: [...new Set(data.map((d) => d.name))].sort(),
      }));
    } catch {
      // silent
    }
  };

  // =====================================================
  // FETCH GLOBAL SUMMARY (COA AWARE)
  // =====================================================
  const fetchGlobalSummary = async (year: string, coa: string) => {
    setLoadingGlobal(true);
    setErrorGlobal(null);

    try {
      const params = new URLSearchParams({ year });
      if (coa) params.append("coa", coa);

      const res = await fetch(
        `/api/dashboard/opex/summary?${params.toString()}`
      );
      if (!res.ok) throw new Error();

      const data: DashboardGlobalSummary = await res.json();
      setGlobalSummary(data);
    } catch {
      setErrorGlobal("Gagal mengambil global summary");
    } finally {
      setLoadingGlobal(false);
    }
  };

  // =====================================================
  // FETCH CHARTS DATA
  // =====================================================
  const fetchChartsData = async (coa: string, year: string) => {
    setLoadingCharts(true);
    setErrorCharts(null);

    try {
      const res = await fetch(
        `/api/dashboard/opex/charts/${coa}?year=${year}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          setChartDistribution([]);
          setChartStatus(null);
          return;
        }
        throw new Error();
      }

      const data = await res.json();
      setChartDistribution(data.distributionData || []);
      setChartStatus(data.statusData || null);
    } catch {
      setErrorCharts("Gagal mengambil data charts");
      setChartDistribution([]);
      setChartStatus(null);
    } finally {
      setLoadingCharts(false);
    }
  };

  // =====================================================
  // FETCH TABLE DATA
  // =====================================================
  const fetchTableData = async (filters: DashboardOpexFilterValue) => {
    setLoadingTable(true);
    setErrorTable(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.append(k, v);
      });

      const res = await fetch(
        `/api/dashboard/opex/tabel-budget?${params.toString()}`
      );
      if (!res.ok) throw new Error();

      const data: BudgetUsageItem[] = await res.json();
      setBudgetData(data);
    } catch {
      setErrorTable("Gagal mengambil data tabel");
    } finally {
      setLoadingTable(false);
    }
  };

  // =====================================================
  // HANDLERS
  // =====================================================
  const handleFilterChange = async (next: DashboardOpexFilterValue) => {
    if (next.year !== filterDraft.year && next.year) {
      const reset: DashboardOpexFilterValue = {
        year: next.year,
        budgetId: "",
        coa: "",
        category: "",
        component: "",
      };

      setFilterDraft(reset);
      await rebuildFilterOptionsByYear(next.year);
    } else {
      setFilterDraft(next);
    }
  };

  const handleSearch = () => {
    const year = filterDraft.year || currentYear;
    const coa = filterDraft.coa ?? "";

    setFilterApplied({ ...filterDraft, year });

    // 🔒 NORMALIZED COA
    fetchGlobalSummary(year, coa);
    fetchTableData({ ...filterDraft, year });

    if (coa) {
      fetchChartsData(coa, year);
    } else {
      setChartDistribution([]);
      setChartStatus(null);
    }
  };

  const handleReset = async () => {
    const reset: DashboardOpexFilterValue = {
      year: currentYear,
      budgetId: "",
      coa: "",
      category: "",
      component: "",
    };

    setFilterDraft(reset);
    setFilterApplied(reset);

    await rebuildFilterOptionsByYear(currentYear);

    // 🔒 RESET = GLOBAL
    fetchGlobalSummary(currentYear, "");
    fetchTableData(reset);

    setChartDistribution([]);
    setChartStatus(null);
  };

  const handleViewDetails = (id: string) => {
    setSelectedBudgetId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBudgetId("");
  };

  const handleRefreshTable = () => {
    fetchTableData(filterApplied);
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

        <h1 className="text-3xl font-bold text-gray-800">Dashboard OPEX</h1>
        <p className="text-gray-600 mt-1">
          Ringkasan penggunaan budget operasional
        </p>
      </div>

      <DashboardOpexFilter
        value={filterDraft}
        options={filterOptions}
        onChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <OpexGlobalSummary
        data={globalSummary}
        loading={loadingGlobal}
        error={errorGlobal}
      />

      {filterApplied.coa && (
        <OpexChartsGrid
          coa={filterApplied.coa}
          distributionData={chartDistribution}
          statusData={chartStatus}
          loading={loadingCharts}
          error={errorCharts}
        />
      )}

      <BudgetUsageTable
        data={budgetData}
        loading={loadingTable}
        onRefresh={handleRefreshTable}
        onViewDetails={handleViewDetails}
      />

      <StatusLegend />

      <TransactionDetailModal
        open={modalOpen}
        budgetId={selectedBudgetId}
        onClose={handleCloseModal}
      />
    </div>
  );
}
