"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import FilterPanel from "@/components/filter/FilterPanel";
import PaginationBar from "@/components/table/PaginationBar";
import TransactionTable, {
  TransactionRow,
} from "@/components/table/TransactionTable";

import { showError, showSuccess } from "@/lib/swal";

/**
 * =========================================
 * FILTER STATE — TRANSACTION OPEX (FINAL)
 * =========================================
 */
export type FilterState = {
  year?: string;
  transactionId?: string;
  budgetId?: string;
  vendor?: string;
  requester?: string;
  description?: string;
};

export default function TransactionsOpexPage() {
  const router = useRouter();

  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<FilterState>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  /**
   * =========================================
   * FETCH DATA
   * =========================================
   */
  async function fetchData() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));

      if (filter.year) params.set("year", filter.year);
      if (filter.transactionId) {
        params.set("transactionId", filter.transactionId);
      }
      if (filter.budgetId) params.set("budgetId", filter.budgetId);
      if (filter.vendor) params.set("vendor", filter.vendor);
      if (filter.requester) params.set("requester", filter.requester);
      if (filter.description) {
        params.set("description", filter.description);
      }

      const res = await fetch(
        `/api/transaction/opex?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil data transaksi");
      }

      const json = await res.json();
      setRows(json.data ?? []);
      setTotal(json.total ?? 0);
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * =========================================
   * EFFECTS
   * =========================================
   */
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  /**
   * =========================================
   * HANDLERS
   * =========================================
   */
  function handleSearch() {
    setPage(1);
    fetchData();
  }

  function handleReset() {
    setFilter({});
    setPage(1);
    fetchData();
  }

  async function handleDelete(id: string): Promise<boolean> {
    // ✅ PERBAIKAN: Ganti dari ?id=${id} menjadi /${id}
    const res = await fetch(
      `/api/transaction/opex/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      const err = await res.json();
      showError(err.error ?? "Gagal menghapus transaksi");
      return false;
    }

    showSuccess("Transaksi berhasil dihapus");
    fetchData();
    return true;
  }

  /**
   * =========================================
   * RENDER
   * =========================================
   */
  if (loading) {
    return <div className="p-6">Loading transaksi…</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Tabel Transaksi OPEX
        </h1>
      </div>

      {/* FILTER */}
      <FilterPanel
        value={filter}
        onChange={setFilter}
        onSearch={handleSearch}
        onReset={handleReset}
        fields={[
          "year",
          "transactionId",
          "budgetId",
          "vendor",
          "requester",
          "description",
        ]}
      />

      {/* TABLE */}
      <TransactionTable
        rows={rows}
        onEdit={(id) =>
          router.push(`/transactions/opex/edit/${id}`)
        }
        onDelete={handleDelete}
      />

      {/* PAGINATION */}
      <PaginationBar
        page={page}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />
    </div>
  );
}