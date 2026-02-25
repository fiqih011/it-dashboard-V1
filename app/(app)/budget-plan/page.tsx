"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Briefcase, TrendingUp, Wallet } from "lucide-react";
import { BudgetPlanOpex, BudgetPlanCapex } from "@prisma/client";

import SummaryCard from "@/components/ui/SummaryCard";
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

type Tab = "opex" | "capex";

function fmt(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
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

  const stats = useMemo(() => ({
    total,
    totalBudget: rows.reduce((s, r) => s + r.totalBudget, 0),
    totalRealisasi: rows.reduce((s, r) => s + r.totalRealisasi, 0),
    totalRemaining: rows.reduce((s, r) => s + r.remaining, 0),
  }), [rows, total]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard icon={<FileText className="w-5 h-5" />} title="Total OPEX Entries" value={String(stats.total)} sub="All budget entries" color="indigo" />
        <SummaryCard icon={<Wallet className="w-5 h-5" />} title="Total Budget" value={fmt(stats.totalBudget)} sub="Planned amount" color="blue" />
        <SummaryCard icon={<TrendingUp className="w-5 h-5" />} title="Total Realization" value={fmt(stats.totalRealisasi)} sub="Realized amount" color="orange" />
        <SummaryCard
          icon={<Wallet className="w-5 h-5" />}
          title="Total Remaining"
          value={fmt(stats.totalRemaining)}
          sub="Available balance"
          color={stats.totalRemaining < 0 ? "red" : "emerald"}
        />
      </div>

      <BudgetPlanFilter
        value={draftFilters}
        onChange={setDraftFilters}
        onSearch={() => { setPage(1); setAppliedFilters(draftFilters); }}
        onReset={() => { const y = { year: String(new Date().getFullYear()) }; setDraftFilters(y); setAppliedFilters(y); setPage(1); }}
      />

      <BudgetPlanTable
        data={rows}
        onEdit={(row) => { const raw = rawRows.find((r) => r.id === row.id); if (raw) setEditRaw(raw); }}
        onInput={(row) => { setSelectedBudgetId(row.id); setOpenInputTx(true); }}
        onDetail={(row) => setDetailRow(row)}
      />

      <PaginationBar
        page={page} pageSize={pageSize} total={total}
        onPageChange={setPage}
        onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
      />

      <CreateBudgetPlanModal open={openCreate} onClose={() => setOpenCreate(false)} onSuccess={() => { fetchData(); }} />

      {editRaw && (
        <EditBudgetPlanModal open data={editRaw} onClose={() => setEditRaw(null)} onSuccess={() => { setEditRaw(null); fetchData(); }} />
      )}

      {detailRow && (
        <TransactionDetailModal open budgetId={detailRow.id} onClose={() => setDetailRow(null)} />
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

  const stats = useMemo(() => ({
    total,
    totalBudget: rows.reduce((s, r) => s + r.totalBudget, 0),
    totalRealisasi: rows.reduce((s, r) => s + r.totalRealisasi, 0),
    totalRemaining: rows.reduce((s, r) => s + r.remaining, 0),
  }), [rows, total]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard icon={<Briefcase className="w-5 h-5" />} title="Total CAPEX Entries" value={String(stats.total)} sub="All budget entries" color="indigo" />
        <SummaryCard icon={<Wallet className="w-5 h-5" />} title="Total Budget" value={fmt(stats.totalBudget)} sub="Planned amount" color="blue" />
        <SummaryCard icon={<TrendingUp className="w-5 h-5" />} title="Total Realization" value={fmt(stats.totalRealisasi)} sub="Realized amount" color="orange" />
        <SummaryCard
          icon={<Wallet className="w-5 h-5" />}
          title="Total Remaining"
          value={fmt(stats.totalRemaining)}
          sub="Available balance"
          color={stats.totalRemaining < 0 ? "red" : "emerald"}
        />
      </div>

      <BudgetPlanCapexFilter
        value={draftFilters}
        onChange={setDraftFilters}
        onSearch={() => { setPage(1); setAppliedFilters(draftFilters); }}
        onReset={() => { const y = { year: String(new Date().getFullYear()) }; setDraftFilters(y); setAppliedFilters(y); setPage(1); }}
      />

      <BudgetPlanCapexTable
        data={rows}
        onEdit={(row) => { const raw = rawRows.find((r) => r.id === row.id); if (raw) setEditRaw(raw); }}
        onInput={(row) => { setSelectedBudgetId(row.id); setOpenInputTx(true); }}
        onDetail={(row) => setDetailRow(row)}
      />

      <PaginationBar
        page={page} pageSize={pageSize} total={total}
        onPageChange={setPage}
        onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
      />

      <CreateBudgetPlanCapexModal open={openCreate} onClose={() => setOpenCreate(false)} onSuccess={() => { fetchData(); }} />

      {editRaw && (
        <EditBudgetPlanCapexModal open data={editRaw} onClose={() => setEditRaw(null)} onSuccess={() => { setEditRaw(null); fetchData(); }} />
      )}

      {detailRow && (
        <TransactionDetailCapexModal open budgetId={detailRow.id} onClose={() => setDetailRow(null)} />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Budget Plan</h1>
          <p className="text-sm text-gray-500 mt-1">Manage operational and capital expenditure budget plans</p>
        </div>
        <button
          onClick={() => tab === "opex" ? setOpenCreateOpex(true) : setOpenCreateCapex(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm"
        >
          + Create Budget Plan
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
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
        <div className="p-6">
          {tab === "opex" ? <OpexTab key="opex" /> : <CapexTab key="capex" />}
        </div>
      </div>

      <CreateBudgetPlanModal open={openCreateOpex} onClose={() => setOpenCreateOpex(false)} onSuccess={() => setOpenCreateOpex(false)} />
      <CreateBudgetPlanCapexModal open={openCreateCapex} onClose={() => setOpenCreateCapex(false)} onSuccess={() => setOpenCreateCapex(false)} />
    </div>
  );
}