"use client";

import { useEffect, useState } from "react";

import BudgetPlanTable, {
  BudgetPlanRow,
} from "@/components/table/BudgetPlanTable";
import PaginationBar from "@/components/table/PaginationBar";
import BudgetPlanFilter from "@/components/filter/BudgetPlanFilter";
import { BudgetPlanFilterValue } from "@/components/filter/types";
import EditBudgetPlanModal from "@/components/modal/EditBudgetPlanModal";
import TransactionDetailModal from "@/components/modal/TransactionDetailModal";

/**
 * =========================================
 * API RAW TYPE (SOURCE OF TRUTH)
 * =========================================
 */
type ApiBudgetPlanOpex = {
  id: string;
  displayId: string;
  year: number;
  coa: string;
  category: string;
  component: string;
  budgetPlanAmount: string;
  budgetRealisasiAmount: string;
  budgetRemainingAmount: string;
};

export default function BudgetPlanOpexPage() {
  const [rows, setRows] = useState<BudgetPlanRow[]>([]);
  const [rawRows, setRawRows] =
    useState<ApiBudgetPlanOpex[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [draftFilters, setDraftFilters] =
    useState<BudgetPlanFilterValue>({});
  const [appliedFilters, setAppliedFilters] =
    useState<BudgetPlanFilterValue>({});

  const [editRaw, setEditRaw] =
    useState<ApiBudgetPlanOpex | null>(null);

  const [detailRow, setDetailRow] =
    useState<BudgetPlanRow | null>(null);

  const [transactionMode, setTransactionMode] =
    useState<"view" | "input">("view");

  /**
   * =========================================
   * FETCH DATA
   * =========================================
   */
  async function fetchData() {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(appliedFilters.year && {
        year: appliedFilters.year,
      }),
      ...(appliedFilters.displayId && {
        displayId: appliedFilters.displayId,
      }),
      ...(appliedFilters.category && {
        category: appliedFilters.category,
      }),
      ...(appliedFilters.component && {
        component: appliedFilters.component,
      }),
    });

    const res = await fetch(
      `/api/budget/opex?${params.toString()}`
    );
    const json = await res.json();

    const apiData: ApiBudgetPlanOpex[] =
      json.data ?? [];

    /**
     * =========================================
     * MAP API → TABLE VIEW MODEL
     * (COA DI-SINKRONKAN DI SINI)
     * =========================================
     */
    const mapped: BudgetPlanRow[] = apiData.map(
      (item) => ({
        id: item.id,
        displayId: item.displayId,
        coa: item.coa, // ✅ INI KUNCI UTAMA
        category: item.category,
        component: item.component,
        totalBudget: Number(item.budgetPlanAmount),
        totalRealisasi: Number(
          item.budgetRealisasiAmount
        ),
        remaining: Number(
          item.budgetRemainingAmount
        ),
      })
    );

    setRawRows(apiData);
    setRows(mapped);
    setTotal(json.total ?? 0);
  }

  useEffect(() => {
    fetchData();
  }, [page, pageSize, appliedFilters]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">
        Tabel Budget Plan OPEX
      </h1>

      {/* FILTER */}
      <BudgetPlanFilter
        value={draftFilters}
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

      {/* TABLE */}
      <BudgetPlanTable
        data={rows}
        onEdit={(row) => {
          const raw = rawRows.find(
            (r) => r.id === row.id
          );
          if (raw) setEditRaw(raw);
        }}
        onInput={(row) => {
          setTransactionMode("input");
          setDetailRow(row);
        }}
        onDetail={(row) => {
          setTransactionMode("view");
          setDetailRow(row);
        }}
      />

      {/* PAGINATION */}
      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* EDIT MODAL */}
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

      {/* TRANSACTION DETAIL / INPUT MODAL */}
      {detailRow && (
        <TransactionDetailModal
          open
          budgetId={detailRow.id}
          mode={transactionMode}
          onClose={() => setDetailRow(null)}
        />
      )}
    </div>
  );
}
