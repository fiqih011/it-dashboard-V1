"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Briefcase, TrendingUp, Wallet } from "lucide-react";
import { BudgetPlanOpex, BudgetPlanCapex } from "@prisma/client";

import BudgetPlanFilter from "@/components/filter/BudgetPlanFilter";
import BudgetPlanCapexFilter from "@/components/filter/BudgetPlanCapexFilter";
import BudgetPlanTable, { BudgetPlanRow } from "@/components/table/BudgetPlanTable";
import BudgetPlanCapexTable, { BudgetPlanCapexRow } from "@/components/table/BudgetPlanCapexTable";
import PaginationBar from "@/components/table/PaginationBar";
import type { BudgetPlanFilterValue, BudgetPlanCapexFilterValue } from "@/components/filter/types";

import CreateBudgetPlanModal from "@/components/modal/CreateBudgetPlanModal";
import EditBudgetPlanModal from "@/components/modal/EditBudgetPlanModal";
import CreateBudgetPlanCapexModal from "@/components/modal/CreateBudgetPlanCapexModal";
import EditBudgetPlanCapexModal from "@/components/modal/EditBudgetPlanCapexModal";
import TransactionDetailModal from "@/components/modal/TransactionDetailModal";
import TransactionDetailCapexModal from "@/components/modal/TransactionDetailCapexModal";
import InputTransactionModal from "@/components/modal/InputTransactionModal";
import InputTransactionCapexModal from "@/components/modal/InputTransactionCapexModal";


// ─────────────────────────────────────────────
type Tab = "opex" | "capex";

function fmt(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

// ─────────────────────────────────────────────
// SUMMARY CARDS
// ─────────────────────────────────────────────
function SummaryCard({
  label,
  value,
  sub,
  gradient,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white`}>
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-white/70 mb-1">{label}</p>
      <p className="text-xl font-bold leading-tight">{value}</p>
      <p className="text-xs text-white/60 mt-0.5">{sub}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// OPEX TAB
// ─────────────────────────────────────────────
function OpexTab() {
  const [rows, setRows] = useState<BudgetPlanRow[]>([]);
  const [rawRows, setRawRows] = useState<BudgetPlanOpex[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [draftFilters, setDraftFilters] = useState<BudgetPlanFilterValue>({ year: String(new Date().getFullYear()) });
  const [appliedFilters, setAppliedFilters] = useState<BudgetPlanFilterValue>({ year: String(new Date().getFullYear()) });

  // Modals
  const [openCreate, setOpenCreate] = useState(false);
  const [editRaw, setEditRaw] = useState<BudgetPlanOpex | null>(null);
  const [detailRow, setDetailRow] = useState<BudgetPlanRow | null>(null);
  const [openInputTx, setOpenInputTx] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState("");

  async function fetchData() {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(appliedFilters.year && { year: appliedFilters.year }),
      ...(appliedFilters.displayId && { displayId: appliedFilters.displayId }),
      ...(appliedFilters.coa && { coa: appliedFilters.coa }),
      ...(appliedFilters.category && { category: appliedFilters.category }),
      ...(appliedFilters.component && { component: appliedFilters.component }),
    });

    const res = await fetch(`/api/budget/opex?${params}`);
    const json = await res.json();
    const apiData: BudgetPlanOpex[] = json.data ?? [];

    // ✅ Mapping persis seperti page asli
    setRows(
      apiData.map((item) => ({
        id: item.id,
        displayId: item.displayId,
        coa: item.coa,
        category: item.category,
        component: item.component,
        totalBudget: Number(item.budgetPlanAmount),
        totalRealisasi: Number(item.budgetRealisasiAmount),
        remaining: Number(item.budgetRemainingAmount),
      }))
    );

    setRawRows(apiData);
    setTotal(json.total ?? 0);
  }

  useEffect(() => { fetchData(); }, [page, pageSize, appliedFilters]);

  // Filter options derived from raw data — persis seperti page asli
  

  const stats = useMemo(() => ({
    total,
    totalBudget: rows.reduce((s, r) => s + r.totalBudget, 0),
    totalRealisasi: rows.reduce((s, r) => s + r.totalRealisasi, 0),
    totalRemaining: rows.reduce((s, r) => s + r.remaining, 0),
  }), [rows, total]);

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Total OPEX Entries" value={String(stats.total)} sub="All budget entries" gradient="from-indigo-600 to-indigo-500" icon={FileText} />
        <SummaryCard label="Total Budget" value={fmt(stats.totalBudget)} sub="Planned amount" gradient="from-blue-600 to-blue-500" icon={Wallet} />
        <SummaryCard label="Total Realization" value={fmt(stats.totalRealisasi)} sub="Realized amount" gradient="from-amber-500 to-orange-400" icon={TrendingUp} />
        <SummaryCard
          label="Total Remaining"
          value={fmt(stats.totalRemaining)}
          sub="Available balance"
          gradient={stats.totalRemaining < 0 ? "from-red-600 to-red-500" : "from-emerald-600 to-emerald-500"}
          icon={Wallet}
        />
      </div>

      {/* Filter */}
      <BudgetPlanFilter
        value={draftFilters}
        onChange={setDraftFilters}
        onSearch={() => { setPage(1); setAppliedFilters(draftFilters); }}
        onReset={() => { const y = { year: String(new Date().getFullYear()) }; setDraftFilters(y); setAppliedFilters(y); setPage(1); }}
      />

      {/* Table */}
      <BudgetPlanTable
        data={rows}
        onEdit={(row) => {
          const raw = rawRows.find((r) => r.id === row.id);
          if (raw) setEditRaw(raw);
        }}
        onInput={(row) => {
          setSelectedBudgetId(row.id);
          setOpenInputTx(true);
        }}
        onDetail={(row) => setDetailRow(row)}
      />

      {/* Pagination */}
      <PaginationBar
        page={page} pageSize={pageSize} total={total}
        onPageChange={setPage}
        onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
      />

      {/* Modals */}
      <CreateBudgetPlanModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => { fetchData(); }}
      />

      {editRaw && (
        <EditBudgetPlanModal
          open
          data={editRaw}
          onClose={() => setEditRaw(null)}
          onSuccess={() => { setEditRaw(null); fetchData(); }}
        />
      )}

      {detailRow && (
        <TransactionDetailModal
          open
          budgetId={detailRow.id}
          onClose={() => setDetailRow(null)}
        />
      )}

      <InputTransactionModal
        open={openInputTx}
        budgetPlanId={selectedBudgetId}
        onClose={() => { setOpenInputTx(false); setSelectedBudgetId(""); }}
        onSuccess={() => { fetchData(); }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// CAPEX TAB
// ─────────────────────────────────────────────
function CapexTab() {
  const [rows, setRows] = useState<BudgetPlanCapexRow[]>([]);
  const [rawRows, setRawRows] = useState<BudgetPlanCapex[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [draftFilters, setDraftFilters] = useState<BudgetPlanCapexFilterValue>({ year: String(new Date().getFullYear()) });
  const [appliedFilters, setAppliedFilters] = useState<BudgetPlanCapexFilterValue>({ year: String(new Date().getFullYear()) });

  // Modals
  const [openCreate, setOpenCreate] = useState(false);
  const [editRaw, setEditRaw] = useState<BudgetPlanCapex | null>(null);
  const [detailRow, setDetailRow] = useState<BudgetPlanCapexRow | null>(null);
  const [openInputTx, setOpenInputTx] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  async function fetchData() {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(appliedFilters.year && { year: appliedFilters.year }),
      ...(appliedFilters.budgetDisplayId && { budgetDisplayId: appliedFilters.budgetDisplayId }),
      ...(appliedFilters.itemCode && { itemCode: appliedFilters.itemCode }),
      ...(appliedFilters.itemDescription && { itemDescription: appliedFilters.itemDescription }),
      ...(appliedFilters.noCapex && { noCapex: appliedFilters.noCapex }),
      ...(appliedFilters.itemRemark && { itemRemark: appliedFilters.itemRemark }),
    });

    const res = await fetch(`/api/budget/capex?${params}`);
    const json = await res.json();
    const apiData: BudgetPlanCapex[] = json.data ?? [];

    // ✅ Mapping persis seperti page asli
    setRows(
      apiData.map((i) => ({
        id: i.id,
        budgetId: i.budgetDisplayId,
        itemCode: i.itemCode,
        itemDescription: i.itemDescription,
        noCapex: i.noCapex,
        itemRemark: i.itemRemark ?? "-",
        totalBudget: Number(i.budgetPlanAmount ?? 0),
        totalRealisasi: Number(i.budgetRealisasiAmount ?? 0),
        remaining: Number(i.budgetRemainingAmount ?? 0),
      }))
    );

    setRawRows(apiData);
    setTotal(json.total ?? 0);
  }

  useEffect(() => { fetchData(); }, [page, pageSize, appliedFilters]);

  // Filter options derived from raw data — persis seperti page asli
  const stats = useMemo(() => ({
    total,
    totalBudget: rows.reduce((s, r) => s + r.totalBudget, 0),
    totalRealisasi: rows.reduce((s, r) => s + r.totalRealisasi, 0),
    totalRemaining: rows.reduce((s, r) => s + r.remaining, 0),
  }), [rows, total]);

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Total CAPEX Entries" value={String(stats.total)} sub="All budget entries" gradient="from-indigo-600 to-indigo-500" icon={Briefcase} />
        <SummaryCard label="Total Budget" value={fmt(stats.totalBudget)} sub="Planned amount" gradient="from-blue-600 to-blue-500" icon={Wallet} />
        <SummaryCard label="Total Realization" value={fmt(stats.totalRealisasi)} sub="Realized amount" gradient="from-amber-500 to-orange-400" icon={TrendingUp} />
        <SummaryCard
          label="Total Remaining"
          value={fmt(stats.totalRemaining)}
          sub="Available balance"
          gradient={stats.totalRemaining < 0 ? "from-red-600 to-red-500" : "from-emerald-600 to-emerald-500"}
          icon={Wallet}
        />
      </div>

      {/* Filter */}
      <BudgetPlanCapexFilter
        value={draftFilters}
        onChange={setDraftFilters}
        onSearch={() => { setPage(1); setAppliedFilters(draftFilters); }}
        onReset={() => { const y = { year: String(new Date().getFullYear()) }; setDraftFilters(y); setAppliedFilters(y); setPage(1); }}
      />

      {/* Table */}
      <BudgetPlanCapexTable
        data={rows}
        onEdit={(row) => {
          const raw = rawRows.find((r) => r.id === row.id);
          if (raw) setEditRaw(raw);
        }}
        onInput={(row) => {
          setSelectedBudgetId(row.id);
          setOpenInputTx(true);
        }}
        onDetail={(row) => setDetailRow(row)}
      />

      {/* Pagination */}
      <PaginationBar
        page={page} pageSize={pageSize} total={total}
        onPageChange={setPage}
        onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
      />

      {/* Modals */}
      <CreateBudgetPlanCapexModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => { fetchData(); }}
      />

      {editRaw && (
        <EditBudgetPlanCapexModal
          open
          data={editRaw}
          onClose={() => setEditRaw(null)}
          onSuccess={() => { setEditRaw(null); fetchData(); }}
        />
      )}

      {detailRow && (
        <TransactionDetailCapexModal
          open
          budgetId={detailRow.id}
          onClose={() => setDetailRow(null)}
        />
      )}

      {selectedBudgetId && (
        <InputTransactionCapexModal
          open={openInputTx}
          budgetPlanCapexId={selectedBudgetId}
          onClose={() => { setOpenInputTx(false); setSelectedBudgetId(null); }}
          onSuccess={() => { fetchData(); }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function BudgetPlanPage() {
  const [tab, setTab] = useState<Tab>("opex");
  const [openCreateOpex, setOpenCreateOpex] = useState(false);
  const [openCreateCapex, setOpenCreateCapex] = useState(false);

  const tabs = [
    { key: "opex" as Tab, label: "OPEX", sub: "Operational Expenditure", Icon: FileText },
    { key: "capex" as Tab, label: "CAPEX", sub: "Capital Expenditure", Icon: Briefcase },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Budget Plan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola budget plan operasional dan capital expenditure
          </p>
        </div>
        <button
          onClick={() => tab === "opex" ? setOpenCreateOpex(true) : setOpenCreateCapex(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm"
        >
          + Create Budget Plan
        </button>
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
          {tab === "opex"
            ? <OpexTab key="opex" />
            : <CapexTab key="capex" />
          }
        </div>
      </div>

      {/* Create Modals dari header button */}
      <CreateBudgetPlanModal
        open={openCreateOpex}
        onClose={() => setOpenCreateOpex(false)}
        onSuccess={() => setOpenCreateOpex(false)}
      />
      <CreateBudgetPlanCapexModal
        open={openCreateCapex}
        onClose={() => setOpenCreateCapex(false)}
        onSuccess={() => setOpenCreateCapex(false)}
      />
    </div>
  );
}