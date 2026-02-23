"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BudgetPlanOpex } from "@prisma/client";
import { ArrowLeft, Plus, FileDown } from "lucide-react";

import BudgetPlanTable, { BudgetPlanRow } from "@/components/table/BudgetPlanTable";
import PaginationBar from "@/components/table/PaginationBar";
import BudgetPlanFilter from "@/components/filter/BudgetPlanFilter";
import EditBudgetPlanModal from "@/components/modal/EditBudgetPlanModal";
import TransactionDetailModal from "@/components/modal/TransactionDetailModal";
import CreateBudgetPlanModal from "@/components/modal/CreateBudgetPlanModal";
import InputTransactionModal from "@/components/modal/InputTransactionModal";
import { showSuccess } from "@/lib/swal";
import type { BudgetPlanFilterValue } from "@/components/filter/types";

export default function BudgetPlanOpexPage() {
  const router = useRouter();

  /* ── DATA ── */
  const [rows, setRows] = useState<BudgetPlanRow[]>([]);
  const [rawRows, setRawRows] = useState<BudgetPlanOpex[]>([]);
  const [total, setTotal] = useState(0);

  /* ── PAGINATION ── */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* ── FILTER ── */
  const [draftFilters, setDraftFilters] = useState<BudgetPlanFilterValue>({});
  const [appliedFilters, setAppliedFilters] = useState<BudgetPlanFilterValue>({});

  /* ── MODAL ── */
  const [editRaw, setEditRaw] = useState<BudgetPlanOpex | null>(null);
  const [detailRow, setDetailRow] = useState<BudgetPlanRow | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openInputModal, setOpenInputModal] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState("");

  /* ── FETCH ── */
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

    const res = await fetch(`/api/budget/opex?${params.toString()}`);
    const json = await res.json();
    const apiData: BudgetPlanOpex[] = json.data ?? [];

    const mapped: BudgetPlanRow[] = apiData.map((item) => ({
      id: item.id,
      displayId: item.displayId,
      coa: item.coa,
      category: item.category,
      component: item.component,
      totalBudget: Number(item.budgetPlanAmount),
      totalRealisasi: Number(item.budgetRealisasiAmount),
      remaining: Number(item.budgetRemainingAmount),
    }));

    setRawRows(apiData);
    setRows(mapped);
    setTotal(json.total ?? 0);
  }

  useEffect(() => {
    fetchData();
  }, [page, pageSize, appliedFilters]);

  /* ── FILTER OPTIONS ── */
  const filterOptions = useMemo(() => {
    const uniq = (arr: (string | null | undefined)[]) =>
      Array.from(new Set(arr.filter((v): v is string => typeof v === "string" && v.trim() !== "").map((v) => v.trim()))).sort();
    return {
      year: uniq(rawRows.map((r) => String(r.year))),
      displayId: uniq(rawRows.map((r) => r.displayId)),
      coa: uniq(rawRows.map((r) => r.coa)),
      category: uniq(rawRows.map((r) => r.category)),
      component: uniq(rawRows.map((r) => r.component)),
    };
  }, [rawRows]);

  /* ── INPUT TRANSACTION ── */
  const handleOpenInputModal = (budgetPlanId: string) => {
    setSelectedBudgetId(budgetPlanId);
    setOpenInputModal(true);
  };

  const handleInputSuccess = () => {
    showSuccess("Transaksi berhasil disimpan");
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div>
        <button
          onClick={() => router.push("/budget-plan")}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Budget Plan OPEX</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Kelola budget plan operasional tahunan dan komponen biaya OPEX
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenCreate(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Create Budget Plan
            </button>
          </div>
        </div>
      </div>

      {/* ── FILTER ── */}
      <BudgetPlanFilter
        value={draftFilters}
        options={filterOptions}
        onChange={setDraftFilters}
        onSearch={() => {
          setPage(1);
          setAppliedFilters(draftFilters);
        }}
        onReset={() => {
          setDraftFilters({});
          setAppliedFilters({});
          setPage(1);
        }}
      />

      {/* ── TABLE ── */}
      <BudgetPlanTable
        data={rows}
        onEdit={(row) => {
          const raw = rawRows.find((r) => r.id === row.id);
          if (raw) setEditRaw(raw);
        }}
        onInput={(row) => handleOpenInputModal(row.id)}
        onDetail={(row) => setDetailRow(row)}
      />

      {/* ── PAGINATION ── */}
      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── MODALS ── */}
      <CreateBudgetPlanModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={fetchData}
      />

      {editRaw && (
        <EditBudgetPlanModal
          open
          data={editRaw}
          onClose={() => setEditRaw(null)}
          onSuccess={() => {
            setEditRaw(null);
            fetchData();
          }}
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
        open={openInputModal}
        budgetPlanId={selectedBudgetId}
        onClose={() => setOpenInputModal(false)}
        onSuccess={handleInputSuccess}
      />
    </div>
  );
}