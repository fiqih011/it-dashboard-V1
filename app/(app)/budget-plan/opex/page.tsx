"use client";

import { useEffect, useState } from "react";

import BudgetPlanTable from "@/components/table/BudgetPlanTable";
import PaginationBar from "@/components/table/PaginationBar";
import FilterPanel, {
  FilterValues,
} from "@/components/filter/FilterPanel";
import EditBudgetPlanModal from "@/components/modal/EditBudgetPlanModal";
import BudgetPlanDetailModal from "@/components/modal/BudgetPlanDetailModal";

import type { BudgetPlanOpex } from "@prisma/client";

export default function BudgetPlanOpexPage() {
  const [rows, setRows] = useState<BudgetPlanOpex[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [draftFilters, setDraftFilters] =
    useState<FilterValues>({});

  const [appliedFilters, setAppliedFilters] =
    useState<FilterValues>({});

  const [editRow, setEditRow] =
    useState<BudgetPlanOpex | null>(null);

  const [detailRow, setDetailRow] =
    useState<BudgetPlanOpex | null>(null);

  async function fetchData() {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(appliedFilters.year && { year: appliedFilters.year }),
      ...(appliedFilters.budgetId && { id: appliedFilters.budgetId }),
      ...(appliedFilters.coa && { coa: appliedFilters.coa }),
      ...(appliedFilters.category && {
        category: appliedFilters.category,
      }),
      ...(appliedFilters.component && {
        component: appliedFilters.component,
      }),
    });

    const res = await fetch(`/api/budget/opex?${params}`);
    const json = await res.json();

    setRows(json.data ?? []);
    setTotal(json.total ?? 0);
  }

  useEffect(() => {
    fetchData();
  }, [page, pageSize, appliedFilters]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        Tabel Budget Plan OPEX
      </h1>

      <FilterPanel
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
        fields={[
          "year",
          "budgetId",
          "coa",
          "category",
          "component",
        ]}
      />

      <BudgetPlanTable
        data={rows}
        onEdit={(row) => setEditRow(row)}
        onDetail={(row) => setDetailRow(row)}
      />

      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {editRow && (
        <EditBudgetPlanModal
          open
          data={editRow}
          onClose={() => setEditRow(null)}
          onSuccess={() => {
            setEditRow(null);
            fetchData();
          }}
        />
      )}

      {detailRow && (
        <BudgetPlanDetailModal
          open
          data={detailRow}
          onClose={() => setDetailRow(null)}
        />
      )}
    </div>
  );
}
