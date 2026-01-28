"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import TransactionFilter from "@/components/filter/TransactionFilter";
import { TransactionFilterValue } from "@/components/filter/types";

import PaginationBar from "@/components/table/PaginationBar";
import TransactionCapexTable, {
  TransactionCapexRow,
} from "@/components/table/TransactionCapexTable";

import EditTransactionCapexModal from "@/components/modal/EditTransactionCapexModal";
import { showError, showSuccess } from "@/lib/swal";

export default function TransactionsCapexPage() {
  const router = useRouter();

  const [rows, setRows] = useState<TransactionCapexRow[]>([]);
  const [loading, setLoading] = useState(false);

  // FILTER
  const [draftFilters, setDraftFilters] =
    useState<TransactionFilterValue>({});
  const [appliedFilters, setAppliedFilters] =
    useState<TransactionFilterValue>({});

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // EDIT MODAL
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
        ) {
          params.set(key, String(value));
        }
      });

      const res = await fetch(
        `/api/transaction/capex?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil data transaksi CAPEX");
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

  async function handleDelete(id: string): Promise<boolean> {
    const res = await fetch(
      `/api/transaction/capex/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      showError(err?.error ?? "Gagal menghapus transaksi");
      return false;
    }

    showSuccess("Transaksi CAPEX berhasil dihapus");
    fetchData();
    return true;
  }

  function handleEdit(id: string) {
    setSelectedId(id);
    setOpenEdit(true);
  }

  if (loading) {
    return <div className="p-6">Loading transaksi CAPEX…</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/transactions")}
          className="inline-flex items-center gap-2 rounded-md bg-slate-300 px-3 py-2 text-sm text-slate-800 hover:bg-slate-400 transition"
        >
          ← Back
        </button>

        <h1 className="text-xl font-semibold text-gray-900">
          Tabel Transaksi CAPEX
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
      <TransactionCapexTable
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

      {/* EDIT MODAL */}
      <EditTransactionCapexModal
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