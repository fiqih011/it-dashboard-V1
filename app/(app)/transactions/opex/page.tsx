"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import TransactionFilter from "@/components/filter/TransactionFilter";
import {
  TransactionFilterValue,
  FilterFieldConfig,
  FilterOption,
} from "@/components/filter/types";
import { transactionFilterConfig } from "@/components/filter/transaction.config";

import PaginationBar from "@/components/table/PaginationBar";
import TransactionTable, {
  TransactionRow,
} from "@/components/table/TransactionTable";

import EditTransactionModal from "@/components/modal/EditTransactionModal";
import { showError, showSuccess } from "@/lib/swal";

/**
 * =========================================
 * HELPERS
 * =========================================
 */
function toOptions(values: Array<string | null | undefined>): FilterOption[] {
  return Array.from(
    new Set(
      values
        .filter((v): v is string => !!v && v.trim() !== "")
        .map((v) => v.trim())
    )
  )
    .sort()
    .map((v) => ({ label: v, value: v }));
}

export default function TransactionsOpexPage() {
  const router = useRouter();

  // =========================
  // TABLE DATA
  // =========================
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // ✅ STABLE FILTER OPTIONS (DARI FETCH PERTAMA)
  // =========================
  const [stableOptions, setStableOptions] = useState<{
    years: FilterOption[];
    transactionIds: FilterOption[];
    budgetPlanIds: FilterOption[];
    vendors: FilterOption[];
    requesters: FilterOption[];
    descriptions: FilterOption[]; // ✅ TAMBAH DESCRIPTIONS
  }>({
    years: [],
    transactionIds: [],
    budgetPlanIds: [],
    vendors: [],
    requesters: [],
    descriptions: [], // ✅ TAMBAH DESCRIPTIONS
  });

  // =========================
  // FILTER STATE
  // =========================
  const [draftFilters, setDraftFilters] =
    useState<TransactionFilterValue>({});
  const [appliedFilters, setAppliedFilters] =
    useState<TransactionFilterValue>({});

  // =========================
  // PAGINATION
  // =========================
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // =========================
  // EDIT MODAL
  // =========================
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /**
   * =========================================
   * ✅ FETCH TABLE DATA (DENGAN STABLE OPTIONS)
   * =========================================
   */
  async function fetchTableData(isInitial = false) {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      // ✅ Apply filters
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          params.set(key, value);
        }
      });

      const res = await fetch(`/api/transaction/opex?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal mengambil data transaksi");

      const json = await res.json();
      setRows(json.data ?? []);
      setTotal(json.total ?? 0);

      // ✅ POLA BUDGET PLAN: Simpan options hanya dari fetch pertama
      if (isInitial && json.data && json.data.length > 0) {
        const data = json.data as TransactionRow[];
        
        setStableOptions({
          years: toOptions(
            data.map((r) =>
              r.submissionDate
                ? new Date(r.submissionDate).getFullYear().toString()
                : null
            )
          ),
          transactionIds: toOptions(data.map((r) => r.displayId)),
          budgetPlanIds: toOptions(data.map((r) => r.budgetPlanDisplayId)),
          vendors: toOptions(data.map((r) => r.vendor)),
          requesters: toOptions(data.map((r) => r.requester)),
          descriptions: toOptions(data.map((r) => r.description)), // ✅ TAMBAH DESCRIPTIONS
        });
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Initial fetch dengan stable options
  useEffect(() => {
    fetchTableData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Subsequent fetches (pagination, filter) TANPA update options
  useEffect(() => {
    if (stableOptions.years.length > 0) {
      fetchTableData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, appliedFilters]);

  /**
   * =========================================
   * ✅ FILTER CONFIG (GUNAKAN STABLE OPTIONS)
   * =========================================
   */
  const filterFields: FilterFieldConfig<TransactionFilterValue>[] = useMemo(() => {
    return transactionFilterConfig.map((field) => {
      if (field.type !== "select") return field;

      switch (field.key) {
        case "year":
          return { ...field, options: stableOptions.years };

        case "transactionDisplayId":
          return { ...field, options: stableOptions.transactionIds };

        case "budgetPlanDisplayId":
          return { ...field, options: stableOptions.budgetPlanIds };

        case "vendor":
          return { ...field, options: stableOptions.vendors };

        case "requester":
          return { ...field, options: stableOptions.requesters };

        case "description":
          return { ...field, options: stableOptions.descriptions }; // ✅ TAMBAH DESCRIPTIONS

        default:
          return field;
      }
    });
  }, [stableOptions]);

  /**
   * =========================================
   * ACTIONS
   * =========================================
   */
  async function handleDelete(id: string): Promise<boolean> {
    const res = await fetch(`/api/transaction/opex/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      showError(err.error ?? "Gagal menghapus transaksi");
      return false;
    }

    showSuccess("Transaksi berhasil dihapus");
    fetchTableData(false);
    return true;
  }

  function handleEdit(id: string) {
    setSelectedId(id);
    setOpenEdit(true);
  }

  if (loading && stableOptions.years.length === 0) {
    return <div className="p-6">Loading transaksi…</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/transactions")}
          className="inline-flex items-center gap-2 rounded-md bg-slate-300 px-3 py-2 text-sm"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold">Tabel Transaksi OPEX</h1>
      </div>

      <TransactionFilter
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
        fields={filterFields}
      />

      <TransactionTable
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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

      <EditTransactionModal
        open={openEdit}
        transactionId={selectedId}
        onClose={() => {
          setOpenEdit(false);
          setSelectedId(null);
        }}
        onSuccess={() => fetchTableData(false)}
      />
    </div>
  );
}