"use client";

import { useEffect, useState } from "react";
import { BudgetPlanOpex } from "@prisma/client";

import BudgetPlanTable, {
  BudgetPlanRow,
} from "@/components/table/BudgetPlanTable";
import PaginationBar from "@/components/table/PaginationBar";
import BudgetPlanFilter from "@/components/filter/BudgetPlanFilter";
import { BudgetPlanFilterValue } from "@/components/filter/types";
import EditBudgetPlanModal from "@/components/modal/EditBudgetPlanModal";
import TransactionDetailModal from "@/components/modal/TransactionDetailModal";
import CreateBudgetPlanModal from "@/components/modal/CreateBudgetPlanModal";
import InputTransactionModal from "@/components/modal/InputTransactionModal"; // ✅ IMPORT MODAL
import Button from "@/components/ui/Button";
import { showSuccess } from "@/lib/swal"; // ✅ IMPORT SWAL

export default function BudgetPlanOpexPage() {
  /**
   * ===============================
   * STATE — DATA
   * ===============================
   */
  const [rows, setRows] = useState<BudgetPlanRow[]>([]);
  const [rawRows, setRawRows] = useState<BudgetPlanOpex[]>([]);
  const [total, setTotal] = useState(0);

  /**
   * ===============================
   * STATE — PAGINATION
   * ===============================
   */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /**
   * ===============================
   * STATE — FILTER
   * ===============================
   */
  const [draftFilters, setDraftFilters] = useState<BudgetPlanFilterValue>({});
  const [appliedFilters, setAppliedFilters] = useState<BudgetPlanFilterValue>({});

  /**
   * ===============================
   * STATE — MODAL
   * ===============================
   */
  const [editRaw, setEditRaw] = useState<BudgetPlanOpex | null>(null);
  const [detailRow, setDetailRow] = useState<BudgetPlanRow | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  
  // ✅ STATE BARU untuk Input Transaction Modal
  const [openInputModal, setOpenInputModal] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState("");

  /**
   * ===============================
   * FETCH DATA
   * ===============================
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
      ...(appliedFilters.coa && {
        coa: appliedFilters.coa,
      }),
      ...(appliedFilters.category && {
        category: appliedFilters.category,
      }),
      ...(appliedFilters.component && {
        component: appliedFilters.component,
      }),
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

  /**
   * ===============================
   * HANDLER — INPUT TRANSACTION MODAL
   * ===============================
   */
  const handleOpenInputModal = (budgetPlanId: string) => {
    console.log("🚀 Opening Input Modal for Budget:", budgetPlanId);
    setSelectedBudgetId(budgetPlanId);
    setOpenInputModal(true);
  };

  const handleInputSuccess = () => {
    showSuccess("Transaksi berhasil disimpan");
    fetchData(); // Refresh data table
  };

  return (
    <div className="space-y-6">
      {/* HEADER + ACTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          Tabel Budget Plan OPEX
        </h1>

        <Button variant="primary" onClick={() => setOpenCreate(true)}>
          + Create Budget Plan
        </Button>
      </div>

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
          const raw = rawRows.find((r) => r.id === row.id);
          if (raw) setEditRaw(raw);
        }}
        onInput={(row) => {
          // ✅ GANTI: Buka modal, bukan navigate
          handleOpenInputModal(row.id);
        }}
        onDetail={(row) => {
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

      {/* CREATE MODAL */}
      <CreateBudgetPlanModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={fetchData}
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

      {/* DETAIL MODAL */}
      {detailRow && (
        <TransactionDetailModal
          open
          budgetId={detailRow.id}
          onClose={() => setDetailRow(null)}
        />
      )}

      {/* ✅ INPUT TRANSACTION MODAL (BARU) */}
      <InputTransactionModal
        open={openInputModal}
        budgetPlanId={selectedBudgetId}
        onClose={() => setOpenInputModal(false)}
        onSuccess={handleInputSuccess}
      />
    </div>
  );
}