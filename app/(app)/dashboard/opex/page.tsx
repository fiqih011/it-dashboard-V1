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
import OpexCoaSummary from "@/components/dashboard/opex/OpexCoaSummary";
import OpexDistributionChart, {
  DistributionChartData,
} from "@/components/dashboard/opex/OpexDistributionChart";

import type {
  DashboardOpexFilterValue,
  DashboardFilterOptions,
  DashboardGlobalSummary,
  DashboardCoaSummary,
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

  const [coaSummary, setCoaSummary] =
    useState<DashboardCoaSummary | null>(null);

  // ✅ FIX: distribution SELALU array
  const [distribution, setDistribution] =
    useState<DistributionChartData[]>([]);

  const [budgetData, setBudgetData] = useState<BudgetUsageItem[]>([]);

  // =====================================================
  // LOADING / ERROR
  // =====================================================
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [loadingCoa, setLoadingCoa] = useState(false);
  const [loadingDistribution, setLoadingDistribution] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);

  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [errorCoa, setErrorCoa] = useState<string | null>(null);
  const [errorDistribution, setErrorDistribution] =
    useState<string | null>(null);
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
    fetchGlobalSummary(currentYear);
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
  // FETCH GLOBAL SUMMARY
  // =====================================================
  const fetchGlobalSummary = async (year: string) => {
    setLoadingGlobal(true);
    setErrorGlobal(null);

    try {
      const res = await fetch(
        `/api/dashboard/opex/summary?year=${year}`
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
  // FETCH COA SUMMARY
  // =====================================================
  const fetchCoaSummary = async (coa: string, year: string) => {
    setLoadingCoa(true);
    setErrorCoa(null);

    try {
      const res = await fetch(
        `/api/dashboard/opex/coa-summary?coa=${coa}&year=${year}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          setCoaSummary(null);
          return;
        }
        throw new Error();
      }

      const data: DashboardCoaSummary = await res.json();
      setCoaSummary(data);
    } catch {
      setErrorCoa("Gagal mengambil COA summary");
    } finally {
      setLoadingCoa(false);
    }
  };

  // =====================================================
  // FETCH DISTRIBUTION
  // =====================================================
  const fetchDistribution = async (coa: string, year: string) => {
    setLoadingDistribution(true);
    setErrorDistribution(null);

    try {
      const res = await fetch(
        `/api/dashboard/opex/coa-distribution?coa=${coa}&year=${year}&limit=10`
      );
      if (!res.ok) throw new Error();

      const data: DistributionChartData[] = await res.json();
      setDistribution(data);
    } catch {
      setErrorDistribution("Gagal mengambil distribution data");
      setDistribution([]);
    } finally {
      setLoadingDistribution(false);
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

    setFilterApplied({ ...filterDraft, year });
    fetchGlobalSummary(year);
    fetchTableData({ ...filterDraft, year });

    if (filterDraft.coa) {
      fetchCoaSummary(filterDraft.coa, year);
      fetchDistribution(filterDraft.coa, year);
    } else {
      setCoaSummary(null);
      setDistribution([]);
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
    fetchGlobalSummary(currentYear);
    fetchTableData(reset);

    setCoaSummary(null);
    setDistribution([]);
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
        <OpexCoaSummary
          data={coaSummary}
          loading={loadingCoa}
          error={errorCoa}
        />
      )}

      {filterApplied.coa && (
        <OpexDistributionChart
          data={distribution}
          coa={filterApplied.coa}
          loading={loadingDistribution}
          error={errorDistribution}
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
