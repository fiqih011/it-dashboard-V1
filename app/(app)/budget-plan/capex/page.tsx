"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BudgetPlanCapex } from "@prisma/client";
import { ArrowLeft } from "lucide-react";

import BudgetPlanCapexTable, {
  BudgetPlanCapexRow,
} from "@/components/table/BudgetPlanCapexTable";
import PaginationBar from "@/components/table/PaginationBar";
import BudgetPlanCapexFilter from "@/components/filter/capex/BudgetPlanCapexFilter";
import type { BudgetPlanCapexFilterValue } from "@/components/filter/capex/types";

import CreateBudgetPlanCapexModal from "@/components/modal/CreateBudgetPlanCapexModal";
import EditBudgetPlanCapexModal from "@/components/modal/EditBudgetPlanCapexModal";
import InputTransactionCapexModal from "@/components/modal/InputTransactionCapexModal";
import TransactionDetailCapexModal from "@/components/modal/TransactionDetailCapexModal"; // ✅ TAMBAHAN

import Button from "@/components/ui/Button";
import { showSuccess } from "@/lib/swal";

export default function BudgetPlanCapexPage() {
  const router = useRouter();

  /* ===============================
     STATE
  =============================== */
  const [rows, setRows] = useState<BudgetPlanCapexRow[]>([]);
  const [rawRows, setRawRows] = useState<BudgetPlanCapex[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [openCreate, setOpenCreate] = useState(false);
  const [editRaw, setEditRaw] = useState<BudgetPlanCapex | null>(null);

  const [openInputTx, setOpenInputTx] = useState(false);
  const [selectedBudgetPlanCapexId, setSelectedBudgetPlanCapexId] =
    useState<string | null>(null);

  // ✅ TAMBAHAN: State untuk modal detail
  const [detailRow, setDetailRow] = useState<BudgetPlanCapexRow | null>(null);

  const [draftFilters, setDraftFilters] =
    useState<BudgetPlanCapexFilterValue>({});
  const [appliedFilters, setAppliedFilters] =
    useState<BudgetPlanCapexFilterValue>({});

  const [filterOptions, setFilterOptions] = useState({
    year: [] as string[],
    budgetDisplayId: [] as string[],
    itemCode: [] as string[],
    itemDescription: [] as string[],
    noCapex: [] as string[],
    itemRemark: [] as string[],
  });

  /* ===============================
     FETCH DATA
  =============================== */
  async function fetchData() {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(appliedFilters.year && { year: appliedFilters.year }),
      ...(appliedFilters.budgetDisplayId && {
        budgetDisplayId: appliedFilters.budgetDisplayId,
      }),
      ...(appliedFilters.itemCode && {
        itemCode: appliedFilters.itemCode,
      }),
      ...(appliedFilters.itemDescription && {
        itemDescription: appliedFilters.itemDescription,
      }),
      ...(appliedFilters.noCapex && {
        noCapex: appliedFilters.noCapex,
      }),
      ...(appliedFilters.itemRemark && {
        itemRemark: appliedFilters.itemRemark,
      }),
    });

    const res = await fetch(`/api/budget/capex?${params}`);
    const json = await res.json();

    const apiData: BudgetPlanCapex[] = json.data ?? [];

    /* FILTER OPTIONS */
    setFilterOptions({
      year: Array.from(new Set(apiData.map((i) => String(i.year)))),
      budgetDisplayId: Array.from(
        new Set(apiData.map((i) => i.budgetDisplayId))
      ),
      itemCode: Array.from(new Set(apiData.map((i) => i.itemCode))),
      itemDescription: Array.from(
        new Set(apiData.map((i) => i.itemDescription))
      ),
      noCapex: Array.from(
        new Set(apiData.map((i) => i.noCapex).filter(Boolean))
      ) as string[],
      itemRemark: Array.from(
        new Set(apiData.map((i) => i.itemRemark).filter(Boolean))
      ) as string[],
    });

    /* MAPPING DATA */
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

  useEffect(() => {
    fetchData();
  }, [page, pageSize, appliedFilters]);

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/budget-plan")}
            className="inline-flex items-center gap-2 rounded-md bg-slate-300 px-3 py-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-xl font-semibold">
            Tabel Budget Plan CAPEX
          </h1>
        </div>

        <Button variant="primary" onClick={() => setOpenCreate(true)}>
          + Create Budget Plan CAPEX
        </Button>
      </div>

      {/* FILTER */}
      <BudgetPlanCapexFilter
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

      {/* TABLE */}
      <BudgetPlanCapexTable
        data={rows}
        onEdit={(row) => {
          const raw = rawRows.find((r) => r.id === row.id);
          if (raw) setEditRaw(raw);
        }}
        onInput={(row) => {
          setSelectedBudgetPlanCapexId(row.id);
          setOpenInputTx(true);
        }}
        onDetail={(row) => {
          setDetailRow(row); // ✅ PERBAIKAN: Buka modal, bukan pindah halaman
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

      {/* MODAL CREATE */}
      <CreateBudgetPlanCapexModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => {
          showSuccess("Budget Plan CAPEX berhasil dibuat");
          fetchData();
        }}
      />

      {/* MODAL EDIT */}
      {editRaw && (
        <EditBudgetPlanCapexModal
          open
          data={editRaw}
          onClose={() => setEditRaw(null)}
          onSuccess={() => {
            showSuccess("Budget Plan CAPEX berhasil diupdate");
            fetchData();
          }}
        />
      )}

      {/* MODAL INPUT TRANSACTION */}
      {selectedBudgetPlanCapexId && (
        <InputTransactionCapexModal
          open={openInputTx}
          budgetPlanCapexId={selectedBudgetPlanCapexId}
          onClose={() => {
            setOpenInputTx(false);
            setSelectedBudgetPlanCapexId(null);
          }}
          onSuccess={() => {
            fetchData();
          }}
        />
      )}

      {/* ✅ MODAL DETAIL TRANSACTION (TAMBAHAN) */}
      {detailRow && (
        <TransactionDetailCapexModal
          open
          budgetId={detailRow.id}
          onClose={() => setDetailRow(null)}
        />
      )}
    </div>
  );
}