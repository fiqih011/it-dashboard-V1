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
function toOptions(values: string[]): FilterOption[] {
  return values.map((v) => ({ label: v, value: v }));
}

export default function TransactionsOpexPage() {
  const router = useRouter();

  const currentYear = new Date().getFullYear().toString();

  // =========================
  // TABLE DATA
  // =========================
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // FILTER OPTIONS (FROM API)
  // =========================
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

  // =========================
  // FILTER STATE
  // =========================
  const [draftFilters, setDraftFilters] =
    useState<TransactionFilterValue>({
      year: currentYear, // DEFAULT TAHUN BERJALAN
    });

  const [appliedFilters, setAppliedFilters] =
    useState<TransactionFilterValue>({
      year: currentYear,
    });

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
   * STATS (BERDASARKAN DATA TABEL)
   * =========================================
   */
  const stats = useMemo(() => {
    const approved = rows.filter((r) => r.status === "Approved").length;
    const pending = rows.filter((r) => r.status === "Pending").length;
    const inProgress = rows.filter((r) => r.status === "In Progress").length;

    return {
      total,
      approved,
      pending,
      inProgress,
    };
  }, [rows, total]);

  /**
   * =========================================
   * FETCH FILTER OPTIONS (BASED ON YEAR)
   * =========================================
   */
  async function fetchFilterOptions(year?: string) {
    try {
      const url = year
        ? `/api/transaction/opex/filter-options?year=${year}`
        : `/api/transaction/opex/filter-options`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal mengambil filter options");

      const json = await res.json();
      setFilterOptions(json);
    } catch (err) {
      console.error("Filter options error:", err);
    }
  }

  /**
   * =========================================
   * FETCH TABLE DATA
   * =========================================
   */
  async function fetchTableData() {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

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
    } catch (err) {
      showError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * =========================================
   * INITIAL LOAD
   * =========================================
   */
  useEffect(() => {
    fetchFilterOptions(currentYear);
    fetchTableData();
    // eslint-disable-next-line
  }, []);

  /**
   * =========================================
   * REFRESH TABLE ON FILTER CHANGE
   * =========================================
   */
  useEffect(() => {
    fetchTableData();
    // eslint-disable-next-line
  }, [page, pageSize, appliedFilters]);

  /**
   * =========================================
   * REFRESH OPTIONS WHEN YEAR DRAFT CHANGED
   * =========================================
   */
  useEffect(() => {
    fetchFilterOptions(draftFilters.year);
  }, [draftFilters.year]);

  /**
   * =========================================
   * FILTER CONFIG
   * =========================================
   */
  const filterFields: FilterFieldConfig<TransactionFilterValue>[] =
    useMemo(() => {
      return transactionFilterConfig.map((field) => {
        if (field.type !== "select") return field;

        switch (field.key) {
          case "year":
            return { ...field, options: toOptions(filterOptions.years) };

          case "transactionDisplayId":
            return {
              ...field,
              options: toOptions(filterOptions.transactionIds),
            };

          case "budgetPlanDisplayId":
            return {
              ...field,
              options: toOptions(filterOptions.budgetPlanIds),
            };

          case "vendor":
            return { ...field, options: toOptions(filterOptions.vendors) };

          case "coa":
            return { ...field, options: toOptions(filterOptions.coas) };

          case "description":
            return {
              ...field,
              options: toOptions(filterOptions.descriptions),
            };

          default:
            return field;
        }
      });
    }, [filterOptions]);

  /**
   * =========================================
   * ACTIONS
   * =========================================
   */
  async function handleDelete(id: string): Promise<boolean> {
    const res = await fetch(`/api/transaction/opex/${id}`, {
      method: "DELETE",
    });

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

  function handleEdit(id: string) {
    setSelectedId(id);
    setOpenEdit(true);
  }

  if (loading && rows.length === 0) {
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

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Transaksi</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {stats.total}
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm p-5">
          <p className="text-sm text-emerald-700">Approved</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">
            {stats.approved}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl shadow-sm p-5">
          <p className="text-sm text-amber-700">Pending</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">
            {stats.pending}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl shadow-sm p-5">
          <p className="text-sm text-blue-700">In Progress</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">
            {stats.inProgress}
          </p>
        </div>
      </div>

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
        onSuccess={() => {
          fetchTableData();
          fetchFilterOptions(draftFilters.year);
        }}
      />
    </div>
  );
}
