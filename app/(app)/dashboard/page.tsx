"use client";

import React, { useEffect, useState, useMemo } from "react";
import { BarChart3, Briefcase } from "lucide-react";

import StatusLegend from "@/components/ui/StatusLegend";
import BudgetUsageTable from "@/components/dashboard/BudgetUsageTable";
import BudgetUsageTableCapex from "@/components/dashboard/BudgetUsageTableCapex";
import TransactionDetailModal from "@/components/modal/TransactionDetailModal";
import TransactionDetailCapexModal from "@/components/modal/TransactionDetailCapexModal";
import type { BudgetUsageItem } from "@/components/dashboard/BudgetUsageTable";
import type { BudgetUsageItemCapex } from "@/components/dashboard/BudgetUsageTableCapex";

import DashboardOpexFilter from "@/components/filter/dashboard/DashboardOpexFilter";
import DashboardCapexFilter, {
  type DashboardCapexFilterValue,
  type DashboardCapexFilterOptions,
} from "@/components/filter/dashboard/DashboardCapexFilter";

import OpexGlobalSummary from "@/components/dashboard/opex/OpexGlobalSummary";
import OpexChartsGrid from "@/components/dashboard/opex/OpexChartsGrid";
import CapexGlobalSummary from "@/components/dashboard/capex/CapexGlobalSummary";
import CapexChartsGrid from "@/components/dashboard/capex/CapexChartsGrid";
import CapexGroupedBarChart from "@/components/dashboard/capex/CapexGroupedBarChart";

import type { DistributionChartData as OpexDistributionChartData } from "@/components/dashboard/opex/OpexDistributionChart";
import type { BudgetStatusData as OpexBudgetStatusData } from "@/components/dashboard/opex/OpexStatusDonutChart";
import type { OpexGroupedBarItem } from "@/components/dashboard/opex/OpexGroupedBarChart";
import type { DistributionChartData as CapexDistributionChartData } from "@/components/dashboard/capex/CapexDistributionChart";
import type { BudgetStatusData as CapexBudgetStatusData } from "@/components/dashboard/capex/CapexStatusDonutChart";

import type {
  DashboardOpexFilterValue,
  DashboardFilterOptions,
} from "@/types/dashboard";

// ─────────────────────────────────────────────
type Tab = "opex" | "capex";

// ─────────────────────────────────────────────
// OPEX TAB
// ─────────────────────────────────────────────
function OpexTab() {
  const currentYear = new Date().getFullYear().toString();

  const [filterDraft, setFilterDraft] = useState<DashboardOpexFilterValue>({
    year: "", budgetId: "", coa: "", category: "", component: "",
  });
  const [filterApplied, setFilterApplied] = useState<DashboardOpexFilterValue>(filterDraft);
  const [filterOptions, setFilterOptions] = useState<DashboardFilterOptions>({
    years: [], budgetIds: [], coas: [], categories: [], components: [],
  });

  const [budgetData, setBudgetData] = useState<BudgetUsageItem[]>([]);
  const [chartDistribution, setChartDistribution] = useState<OpexDistributionChartData[]>([]);
  const [chartStatus, setChartStatus] = useState<OpexBudgetStatusData | null>(null);

  const [loadingCharts, setLoadingCharts] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [errorCharts, setErrorCharts] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState("");

  useEffect(() => { init(); }, []);

  const init = async () => {
    await fetchAvailableYears();
    setFilterDraft((prev) => ({ ...prev, year: currentYear }));
    setFilterApplied((prev) => ({ ...prev, year: currentYear }));
    await rebuildFilterOptionsByYear(currentYear);
    fetchTableData({ year: currentYear, budgetId: "", coa: "", category: "", component: "" });
  };

  const fetchAvailableYears = async () => {
    try {
      const res = await fetch("/api/dashboard/opex/years");
      if (!res.ok) throw new Error();
      const years: number[] = await res.json();
      setFilterOptions((prev) => ({ ...prev, years: years.map(String) }));
    } catch {
      const y = new Date().getFullYear();
      setFilterOptions((prev) => ({
        ...prev, years: Array.from({ length: 5 }, (_, i) => String(y - i)),
      }));
    }
  };

  const rebuildFilterOptionsByYear = async (year: string) => {
    try {
      const res = await fetch(`/api/dashboard/opex/tabel-budget?year=${year}`);
      if (!res.ok) throw new Error();
      const data: BudgetUsageItem[] = await res.json();
      setFilterOptions((prev) => ({
        ...prev,
        budgetIds: [...new Set(data.map((d) => d.budgetId))].sort(),
        coas: [...new Set(data.map((d) => d.coa))].sort(),
        categories: [...new Set(data.map((d) => d.name))].sort(),
        components: [...new Set(data.map((d) => d.name))].sort(),
      }));
    } catch { /* silent */ }
  };

  const fetchTableData = async (filters: DashboardOpexFilterValue) => {
    setLoadingTable(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const res = await fetch(`/api/dashboard/opex/tabel-budget?${params.toString()}`);
      if (!res.ok) throw new Error();
      setBudgetData(await res.json());
    } finally { setLoadingTable(false); }
  };

  const fetchChartsData = async (coa: string, year: string) => {
    setLoadingCharts(true);
    setErrorCharts(null);
    try {
      const res = await fetch(`/api/dashboard/opex/charts/${coa}?year=${year}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setChartDistribution(data.distributionData || []);
      setChartStatus(data.statusData || null);
    } catch {
      setErrorCharts("Gagal mengambil data charts");
      setChartDistribution([]);
      setChartStatus(null);
    } finally { setLoadingCharts(false); }
  };

  const groupedBarData: OpexGroupedBarItem[] | null = useMemo(() => {
    if (!filterApplied.coa || budgetData.length === 0) return null;
    return budgetData.map((item) => ({
      code: item.budgetId, name: item.name,
      totalBudget: item.totalBudget, used: item.used,
    }));
  }, [filterApplied.coa, budgetData]);

  const handleFilterChange = async (next: DashboardOpexFilterValue) => {
    if (next.year !== filterDraft.year && next.year) {
      const reset: DashboardOpexFilterValue = { year: next.year, budgetId: "", coa: "", category: "", component: "" };
      setFilterDraft(reset);
      await rebuildFilterOptionsByYear(next.year);
    } else {
      setFilterDraft(next);
    }
  };

  const handleSearch = () => {
    const year = filterDraft.year || currentYear;
    setFilterApplied({ ...filterDraft, year });
    fetchTableData({ ...filterDraft, year });
    if (filterDraft.coa) {
      fetchChartsData(filterDraft.coa, year);
    } else {
      setChartDistribution([]);
      setChartStatus(null);
    }
  };

  const handleReset = async () => {
    const reset: DashboardOpexFilterValue = { year: currentYear, budgetId: "", coa: "", category: "", component: "" };
    setFilterDraft(reset);
    setFilterApplied(reset);
    await rebuildFilterOptionsByYear(currentYear);
    fetchTableData(reset);
    setChartDistribution([]);
    setChartStatus(null);
  };

  return (
    <div className="space-y-5">
      <DashboardOpexFilter
        value={filterDraft}
        options={filterOptions}
        onChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <OpexGlobalSummary data={budgetData} loading={loadingTable} />

      {filterApplied.coa && (
        <OpexChartsGrid
          coa={filterApplied.coa}
          distributionData={chartDistribution}
          statusData={chartStatus}
          groupedBarData={groupedBarData}
          loading={loadingCharts}
          error={errorCharts}
        />
      )}

      <BudgetUsageTable
        data={budgetData}
        loading={loadingTable}
        onViewDetails={(id) => { setSelectedBudgetId(id); setModalOpen(true); }}
      />

      <StatusLegend />

      <TransactionDetailModal
        open={modalOpen}
        budgetId={selectedBudgetId}
        onClose={() => { setModalOpen(false); setSelectedBudgetId(""); }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// CAPEX TAB
// ─────────────────────────────────────────────
function CapexTab() {
  const [filterDraft, setFilterDraft] = useState<DashboardCapexFilterValue>({
    year: "", budgetId: "", itemCode: "", itemDescription: "", noCapex: "", itemRemark: "",
  });
  const [filterApplied, setFilterApplied] = useState<DashboardCapexFilterValue>(filterDraft);
  const [filterOptions, setFilterOptions] = useState<DashboardCapexFilterOptions>({
    years: [], budgetIds: [], itemCodes: [], itemDescriptions: [], noCapexList: [], itemRemarks: [],
  });

  const [tableData, setTableData] = useState<BudgetUsageItemCapex[]>([]);
  const [distributionData, setDistributionData] = useState<CapexDistributionChartData[]>([]);
  const [statusData, setStatusData] = useState<CapexBudgetStatusData | null>(null);

  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [errorCharts, setErrorCharts] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState("");

  useEffect(() => { init(); }, []);

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
    await rebuildFilterOptionsByYear(defaultYear);
    fetchTableData({ year: defaultYear, budgetId: "", itemCode: "", itemDescription: "", noCapex: "", itemRemark: "" });
  };

  const rebuildFilterOptionsByYear = async (year: string) => {
    try {
      const res = await fetch(`/api/dashboard/capex/tabel-budget?year=${year}`);
      if (!res.ok) throw new Error();
      const data: BudgetUsageItemCapex[] = await res.json();
      setFilterOptions((prev) => ({
        ...prev,
        budgetIds: [...new Set(data.map((d) => d.budgetId))].sort(),
        itemCodes: [...new Set(data.map((d) => d.itemCode).filter(Boolean))].sort(),
        itemDescriptions: [...new Set(data.map((d) => d.itemDescription).filter(Boolean))].sort(),
        noCapexList: [...new Set(data.map((d) => d.noCapex).filter(Boolean))].sort(),
        itemRemarks: [...new Set(data.map((d) => d.itemRemark).filter(Boolean))].sort(),
      }));
    } catch { /* silent */ }
  };

  const fetchTableData = async (filters: DashboardCapexFilterValue) => {
    setLoadingTable(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const res = await fetch(`/api/dashboard/capex/tabel-budget?${params.toString()}`);
      if (!res.ok) throw new Error();
      setTableData(await res.json());
    } finally { setLoadingTable(false); }
  };

  const fetchChartsData = async (noCapex: string, year: string) => {
    setLoadingCharts(true);
    setErrorCharts(null);
    try {
      const res = await fetch(`/api/dashboard/capex/charts/${encodeURIComponent(noCapex)}?year=${year}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDistributionData(data.distributionData || []);
      setStatusData(data.statusData || null);
    } catch {
      setErrorCharts("Gagal mengambil data charts");
      setDistributionData([]);
      setStatusData(null);
    } finally { setLoadingCharts(false); }
  };

  const handleFilterChange = async (next: DashboardCapexFilterValue) => {
    if (next.year !== filterDraft.year && next.year) {
      const reset: DashboardCapexFilterValue = { year: next.year, budgetId: "", itemCode: "", itemDescription: "", noCapex: "", itemRemark: "" };
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

  const chartData = tableData.map((item) => ({
    code: item.budgetId, name: item.itemDescription,
    totalBudget: item.totalBudget, used: item.used,
  }));

  return (
    <div className="space-y-5">
      <DashboardCapexFilter
        value={filterDraft}
        options={filterOptions}
        onChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <CapexGlobalSummary data={tableData} loading={loadingTable} />

      <CapexGroupedBarChart data={chartData} loading={loadingTable} error={null} />

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
        onViewDetails={(id) => { setSelectedBudgetId(id); setModalOpen(true); }}
      />

      <StatusLegend />

      <TransactionDetailCapexModal
        open={modalOpen}
        budgetId={selectedBudgetId}
        onClose={() => { setModalOpen(false); setSelectedBudgetId(""); }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("opex");

  const tabs = [
    { key: "opex" as Tab, label: "OPEX", sub: "Operational Expenditure", Icon: BarChart3 },
    { key: "capex" as Tab, label: "CAPEX", sub: "Capital Expenditure", Icon: Briefcase },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ringkasan penggunaan budget operasional dan capital expenditure
        </p>
      </div>

      {/* Tab Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Tab Bar */}
        <div className="border-b border-gray-200 px-6 pt-4 flex gap-1">
          {tabs.map(({ key, label, sub, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-t-xl border-b-2 transition-all -mb-px ${
                tab === key
                  ? "border-indigo-600 text-indigo-700 bg-indigo-50/60"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${tab === key ? "text-indigo-600" : "text-gray-400"}`} />
              <span>{label}</span>
              <span className="hidden sm:inline text-xs text-gray-400 font-normal">— {sub}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {tab === "opex" ? <OpexTab key="opex" /> : <CapexTab key="capex" />}
        </div>
      </div>
    </div>
  );
}