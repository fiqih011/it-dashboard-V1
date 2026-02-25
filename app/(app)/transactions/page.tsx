"use client";

import { useEffect, useMemo, useState } from "react";
import { Receipt, Building2, TrendingUp, FileText } from "lucide-react";

import TransactionFilter from "@/components/filter/TransactionFilter";
import TransactionCapexFilter from "@/components/filter/TransactionCapexFilter";
import {
  TransactionFilterValue,
  FilterFieldConfig,
  FilterOption,
} from "@/components/filter/types";
import {
  TransactionCapexFilterValue,
  transactionCapexFilterConfig,
} from "@/components/filter/transaction-capex.config";
import { transactionFilterConfig } from "@/components/filter/transaction.config";

import PaginationBar from "@/components/table/PaginationBar";
import TransactionTable, {
  TransactionRow,
} from "@/components/table/TransactionTable";
import TransactionCapexTable, {
  TransactionCapexRow,
} from "@/components/table/TransactionCapexTable";

import EditTransactionModal from "@/components/modal/EditTransactionModal";
import EditTransactionCapexModal from "@/components/modal/EditTransactionCapexModal";
import { showError, showSuccess } from "@/lib/swal";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function toOptions(values: string[]): FilterOption[] {
  return values.map((v) => ({ label: v, value: v }));
}

type Tab = "opex" | "capex";

// ─────────────────────────────────────────────
// SUMMARY CARDS
// ─────────────────────────────────────────────
type SummaryCardProps = {
  label: string;
  value: number;
  sub: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
};

function SummaryCard({ label, value, sub, gradient, icon: Icon }: SummaryCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white`}>
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-white/70 mb-1">
        {label}
      </p>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-white/60 mt-0.5">{sub}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// OPEX TAB
// ─────────────────────────────────────────────
function OpexTab() {
  const currentYear = new Date().getFullYear().toString();

  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filterOptions, setFilterOptions] = useState<{
    years: string[];
    transactionIds: string[];
    budgetPlanIds: string[];
    vendors: string[];
    coas: string[];
    descriptions: string[];
  }>({
    years: [],
    transactionIds: [],
    budgetPlanIds: [],
    vendors: [],
    coas: [],
    descriptions: [],
  });

  const [draftFilters, setDraftFilters] = useState<TransactionFilterValue>({
    year: currentYear,
  });
  const [appliedFilters, setAppliedFilters] = useState<TransactionFilterValue>({
    year: currentYear,
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function fetchFilterOptions(year?: string) {
    try {
      const url = year
        ? `/api/transaction/opex/filter-options?year=${year}`
        : `/api/transaction/opex/filter-options`;
      const res = await fetch(url);
      if (res.ok) setFilterOptions(await res.json());
    } catch (err) {
      console.error("Filter options error:", err);
    }
  }

  async function fetchTableData() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      Object.entries(appliedFilters).forEach(([k, v]) => {
        if (v && v.trim()) params.set(k, v);
      });
      const res = await fetch(`/api/transaction/opex?${params}`);
      if (!res.ok) throw new Error("Gagal mengambil data transaksi");
      const json = await res.json();
      const data: TransactionRow[] = json.data ?? [];
      setRows(data);
      setTotal(json.total ?? 0);

      // ✅ Derive budgetPlanIds dari display ID di row data
      const budgetDisplayIds = Array.from(
        new Set(data.map((r) => r.budgetPlanDisplayId).filter((v): v is string => !!v))
      ).sort();
      setFilterOptions((prev) => ({ ...prev, budgetPlanIds: budgetDisplayIds }));
    } catch (err) {
      showError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFilterOptions(currentYear);
    fetchTableData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchTableData();
    // eslint-disable-next-line
  }, [page, pageSize, appliedFilters]);

  useEffect(() => {
    fetchFilterOptions(draftFilters.year);
  }, [draftFilters.year]);

  const filterFields: FilterFieldConfig<TransactionFilterValue>[] = useMemo(() =>
    transactionFilterConfig.map((field) => {
      if (field.type !== "select") return field;
      const map: Record<string, string[]> = {
        year: filterOptions.years,
        transactionDisplayId: filterOptions.transactionIds,
        budgetPlanDisplayId: filterOptions.budgetPlanIds,
        vendor: filterOptions.vendors,
        coa: filterOptions.coas,
        description: filterOptions.descriptions,
      };
      const key = field.key as string;
      return map[key] ? { ...field, options: toOptions(map[key]) } : field;
    }),
    [filterOptions]
  );

  async function handleDelete(id: string): Promise<boolean> {
    const res = await fetch(`/api/transaction/opex/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      showError(err.error ?? "Gagal menghapus transaksi");
      return false;
    }
    showSuccess("Transaksi berhasil dihapus");
    fetchTableData();
    fetchFilterOptions(draftFilters.year);
    return true;
  }

  const stats = useMemo(
    () => ({
      total,
      approved: rows.filter((r) => r.status === "Approved").length,
      pending: rows.filter((r) => r.status === "Pending").length,
      inProgress: rows.filter((r) => r.status === "In Progress").length,
    }),
    [rows, total]
  );

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Total OPEX Transactions" value={stats.total} sub="All transactions" gradient="from-indigo-600 to-indigo-500" icon={Receipt} />
        <SummaryCard label="Approved" value={stats.approved} sub="Transactions approved" gradient="from-blue-600 to-blue-500" icon={TrendingUp} />
        <SummaryCard label="Pending" value={stats.pending} sub="Awaiting review" gradient="from-amber-500 to-orange-400" icon={FileText} />
        <SummaryCard label="In Progress" value={stats.inProgress} sub="Being processed" gradient="from-emerald-600 to-emerald-500" icon={TrendingUp} />
      </div>

      {/* Filter — collapsible handled by BaseFilter internally */}
      <TransactionFilter
        value={draftFilters}
        onChange={setDraftFilters}
        onSearch={() => {
          setPage(1);
          setAppliedFilters(draftFilters);
        }}
        onReset={() => {
          setDraftFilters({ year: currentYear });
          setAppliedFilters({ year: currentYear });
          setPage(1);
        }}
        fields={filterFields}
      />

      {/* Table */}
      <TransactionTable
        rows={rows}
        onEdit={(id) => {
          setSelectedId(id);
          setOpenEdit(true);
        }}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />

      {/* Edit Modal */}
      <EditTransactionModal
        open={openEdit}
        transactionId={selectedId}
        onClose={() => {
          setOpenEdit(false);
          setSelectedId(null);
        }}
        onSuccess={() => {
          fetchTableData();
          fetchFilterOptions(draftFilters.year);
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// CAPEX TAB
// ─────────────────────────────────────────────
function CapexTab() {
  const currentYear = new Date().getFullYear().toString();

  const [rows, setRows] = useState<TransactionCapexRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filterOptions, setFilterOptions] = useState<{
    years: string[];
    transactionIds: string[];
    budgetPlanIds: string[];
    vendors: string[];
    requesters: string[];
    descriptions: string[];
  }>({
    years: [],
    transactionIds: [],
    budgetPlanIds: [],
    vendors: [],
    requesters: [],
    descriptions: [],
  });

  const [draftFilters, setDraftFilters] = useState<TransactionCapexFilterValue>({
    year: currentYear,
  });
  const [appliedFilters, setAppliedFilters] = useState<TransactionCapexFilterValue>({
    year: currentYear,
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function fetchFilterOptions(year?: string) {
    try {
      const url = year
        ? `/api/transaction/capex/filter-options?year=${year}`
        : `/api/transaction/capex/filter-options`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setFilterOptions(data);
      }
    } catch (err) {
      console.error("Filter options error:", err);
    }
  }

  async function fetchTableData() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      Object.entries(appliedFilters).forEach(([k, v]) => {
        if (v && v.trim()) params.set(k, v);
      });
      const res = await fetch(`/api/transaction/capex?${params}`);
      if (!res.ok) throw new Error("Gagal mengambil data transaksi CAPEX");
      const json = await res.json();
      const data: TransactionCapexRow[] = json.data ?? [];
      setRows(data);
      setTotal(json.total ?? 0);

      // ✅ Derive budgetPlanIds dari field budgetPlanCapexId di row
      // CAPEX pakai budgetPlanCapexId (bukan budgetPlanDisplayId seperti OPEX)
      const budgetDisplayIds = Array.from(
        new Set(data.map((r) => r.budgetPlanCapexId).filter((v): v is string => !!v))
      ).sort();
      setFilterOptions((prev) => ({ ...prev, budgetPlanIds: budgetDisplayIds }));
    } catch (err) {
      showError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFilterOptions(currentYear);
    fetchTableData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchTableData();
    // eslint-disable-next-line
  }, [page, pageSize, appliedFilters]);

  useEffect(() => {
    fetchFilterOptions(draftFilters.year);
  }, [draftFilters.year]);

  const filterFields: FilterFieldConfig<TransactionCapexFilterValue>[] = useMemo(() =>
    transactionCapexFilterConfig.map((field) => {
      if (field.type !== "select") return field;
      const map: Record<string, string[]> = {
        year: filterOptions.years,
        transactionDisplayId: filterOptions.transactionIds,
        budgetPlanDisplayId: filterOptions.budgetPlanIds, // ✅ Sekarang berisi display IDs
        vendor: filterOptions.vendors,
        requester: filterOptions.requesters,
        description: filterOptions.descriptions,
      };
      const key = field.key as string;
      return map[key] ? { ...field, options: toOptions(map[key]) } : field;
    }),
    [filterOptions]
  );

  async function handleDelete(id: string): Promise<boolean> {
    const res = await fetch(`/api/transaction/capex/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      showError(err.error ?? "Gagal menghapus transaksi");
      return false;
    }
    showSuccess("Transaksi CAPEX berhasil dihapus");
    fetchTableData();
    fetchFilterOptions(draftFilters.year);
    return true;
  }

  const stats = useMemo(
    () => ({
      total,
      approved: rows.filter((r) => r.status === "Approved").length,
      pending: rows.filter((r) => r.status === "Pending").length,
      inProgress: rows.filter((r) => r.status === "In Progress").length,
    }),
    [rows, total]
  );

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Total CAPEX Transactions" value={stats.total} sub="All transactions" gradient="from-indigo-600 to-indigo-500" icon={Building2} />
        <SummaryCard label="Approved" value={stats.approved} sub="Transactions approved" gradient="from-blue-600 to-blue-500" icon={TrendingUp} />
        <SummaryCard label="Pending" value={stats.pending} sub="Awaiting review" gradient="from-amber-500 to-orange-400" icon={FileText} />
        <SummaryCard label="In Progress" value={stats.inProgress} sub="Being processed" gradient="from-emerald-600 to-emerald-500" icon={TrendingUp} />
      </div>

      {/* Filter — collapsible handled by BaseFilter internally */}
      <TransactionCapexFilter
        value={draftFilters}
        onChange={setDraftFilters}
        onSearch={() => {
          setPage(1);
          setAppliedFilters(draftFilters);
        }}
        onReset={() => {
          setDraftFilters({ year: currentYear });
          setAppliedFilters({ year: currentYear });
          setPage(1);
        }}
        fields={filterFields}
      />

      {/* Table */}
      <TransactionCapexTable
        rows={rows}
        onEdit={(id) => {
          setSelectedId(id);
          setOpenEdit(true);
        }}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />

      {/* Edit Modal */}
      <EditTransactionCapexModal
        open={openEdit}
        transactionId={selectedId}
        onClose={() => {
          setOpenEdit(false);
          setSelectedId(null);
        }}
        onSuccess={() => {
          fetchTableData();
          fetchFilterOptions(draftFilters.year);
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function TransactionsPage() {
  const [tab, setTab] = useState<Tab>("opex");

  const tabs = [
    { key: "opex" as Tab, label: "OPEX", sub: "Operational Expenditure", Icon: Receipt },
    { key: "capex" as Tab, label: "CAPEX", sub: "Capital Expenditure", Icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola transaksi operasional dan capital expenditure
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
              <Icon
                className={`w-4 h-4 ${
                  tab === key ? "text-indigo-600" : "text-gray-400"
                }`}
              />
              <span>{label}</span>
              <span className="hidden sm:inline text-xs text-gray-400 font-normal">
                — {sub}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {tab === "opex" ? <OpexTab /> : <CapexTab />}
        </div>
      </div>
    </div>
  );
}