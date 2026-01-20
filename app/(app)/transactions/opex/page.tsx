"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import TransactionFilter from "@/components/filter/TransactionFilter";
import { TransactionFilterValue } from "@/components/filter/types";

import PaginationBar from "@/components/table/PaginationBar";
import TransactionTable from "@/components/table/TransactionTable";
import type { TransactionRow } from "@/components/table/TransactionTable";

import EditTransactionModal from "@/components/modal/EditTransactionModal";
import { showError, showSuccess } from "@/lib/swal";

export default function TransactionsOpexPage() {
  const router = useRouter(); // ✅ ONLY ADDITION

  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔒 FILTER STATE
  const [draftFilters, setDraftFilters] =
    useState<TransactionFilterValue>({});
  const [appliedFilters, setAppliedFilters] =
    useState<TransactionFilterValue>({});

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 🔑 EDIT MODAL STATE
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  /**
   * =========================================
   * FETCH DATA
   * =========================================
   */
  async function fetchData() {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, appliedFilters]);

  /**
   * =========================================
   * DELETE
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
   * EDIT (OPEN MODAL)
   * =========================================
   */
  function handleEdit(id: string) {
    setSelectedId(id);
    setOpenEdit(true);
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
      {/* HEADER + BACK */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/transactions")}
          className="inline-flex items-center gap-2 rounded-md bg-slate-300 px-3 py-2 text-sm text-slate-800 hover:bg-slate-400 transition"
        >
          ← Back
        </button>

        <h1 className="text-xl font-semibold text-gray-900">
          Tabel Transaksi OPEX
        </h1>
      </div>

      {/* FILTER */}
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
        onEdit={handleEdit}
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

      {/* 🔑 EDIT MODAL */}
      <EditTransactionModal
        open={openEdit}
        transactionId={selectedId}
        onClose={() => {
          setOpenEdit(false);
          setSelectedId(null);
        }}
        onSuccess={fetchData}
      />
    </div>
  );
}
