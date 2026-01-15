"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import TransactionFilter from "@/components/filter/TransactionFilter";
import { TransactionFilterValue } from "@/components/filter/types";

import PaginationBar from "@/components/table/PaginationBar";
import TransactionTable from "@/components/table/TransactionTable";
import type { TransactionRow } from "@/components/table/TransactionTable";

import { showError, showSuccess } from "@/lib/swal";

export default function TransactionsOpexPage() {
  const router = useRouter();

  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔒 FILTER STATE — STRICT & GENERIC
  const [draftFilters, setDraftFilters] =
    useState<TransactionFilterValue>({});
  const [appliedFilters, setAppliedFilters] =
    useState<TransactionFilterValue>({});

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  /**
   * =========================================
   * FETCH DATA — GENERIC & TYPE SAFE
   * =========================================
   */
  async function fetchData() {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      // ✅ GENERIC FILTER → QUERY (NO HARDCODE FIELD)
      Object.entries(appliedFilters).forEach(
        ([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
          ) {
            params.set(key, String(value));
          }
        }
      );

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
  }, [page, pageSize, appliedFilters]);

  /**
   * =========================================
   * ACTIONS
   * =========================================
   */
  async function handleDelete(
    id: string
  ): Promise<boolean> {
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
        <h1 className="text-xl font-semibold text-gray-900">
          Tabel Transaksi OPEX
        </h1>
      </div>

      {/* FILTER — FINAL SYSTEM */}
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
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />
    </div>
  );
}
