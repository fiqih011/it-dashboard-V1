"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import DataTable, { Column } from "@/components/table/DataTable";
import TableScrollX from "@/components/table/TableScrollX";
import FilterPanel from "@/components/filter/FilterPanel";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

type TabType = "OPEX" | "CAPEX";

type TransactionRow = {
  id: string; // UUID (TIDAK DITAMPILKAN)
  budgetPlanDisplayId: string;

  vendor?: string;
  requester?: string;

  prNumber?: string;
  poType?: string;
  poNumber?: string;
  documentGr?: string;

  description?: string;

  qty?: number;
  amount?: string;

  submissionDate?: string;
  approvedDate?: string;
  deliveryDate?: string;

  oc?: string;
  ccLob?: string;
  coa?: string;

  status?: string;
  notes?: string;
};

export default function TransactionTablePage() {
  const router = useRouter();

  const [tab, setTab] = useState<TabType>("OPEX");
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 🔹 PAGINATION STATE
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = rows.length;

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return rows.slice(start, end);
  }, [rows, page, pageSize]);

  const startEntry = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  const fetchData = async () => {
    setLoading(true);
    setError(false);

    try {
      const endpoint =
        tab === "OPEX"
          ? "/api/transaction/opex"
          : "/api/transaction/capex";

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Fetch failed");

      const json = await res.json();
      setRows(Array.isArray(json.data) ? json.data : []);
      setPage(1); // reset page saat tab / fetch
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const columns: Column<TransactionRow>[] = [
    { header: "Budget Plan ID", accessor: "budgetPlanDisplayId" },
    { header: "Vendor", accessor: "vendor" },
    { header: "Requester", accessor: "requester" },
    { header: "PR Number", accessor: "prNumber" },
    { header: "PO Type", accessor: "poType" },
    { header: "PO Number", accessor: "poNumber" },
    { header: "Document GR", accessor: "documentGr" },
    { header: "Description", accessor: "description" },
    { header: "QTY", accessor: "qty" },
    { header: "Amount", accessor: "amount" },
    { header: "Submission Date", accessor: "submissionDate" },
    { header: "Approved Date", accessor: "approvedDate" },
    { header: "Delivery Date", accessor: "deliveryDate" },
    { header: "O/C", accessor: "oc" },
    { header: "CC / LOB", accessor: "ccLob" },
    { header: "COA", accessor: "coa" },
    { header: "Status", accessor: "status" },
    { header: "Notes", accessor: "notes" },
    {
      header: "Action",
      accessor: (row) => (
        <Button
          variant="secondary"
          onClick={() =>
            router.push(
              `/input/transaction/${tab.toLowerCase()}/${row.id}`
            )
          }
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Tabel Transaksi</h1>

      {/* TAB SWITCH */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={tab === "OPEX" ? "primary" : "secondary"}
          onClick={() => setTab("OPEX")}
        >
          OPEX
        </Button>
        <Button
          variant={tab === "CAPEX" ? "primary" : "secondary"}
          onClick={() => setTab("CAPEX")}
        >
          CAPEX
        </Button>
      </div>

      <FilterPanel
        fields={[
          {
            key: "year",
            label: "Tahun",
            type: "select",
            options: [{ label: "All", value: "" }],
          },
          {
            key: "vendor",
            label: "Vendor",
            placeholder: "Vendor",
          },
          {
            key: "status",
            label: "Status",
            placeholder: "Status",
          },
        ]}
        onSearch={fetchData}
        onReset={fetchData}
      />

      {loading && <LoadingState />}
      {error && <ErrorState onRetry={fetchData} />}
      {!loading && !error && rows.length === 0 && <EmptyState />}

      {!loading && !error && rows.length > 0 && (
        <>
          <TableScrollX minWidth={1800}>
            <DataTable columns={columns} data={paginatedRows} />
          </TableScrollX>

          {/* 🔹 PAGINATION FOOTER */}
          <div className="flex items-center justify-between text-sm">
            <div>
              Showing {startEntry}-{endEntry} of {total} entries
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>

              <span>
                {page} / {Math.max(1, Math.ceil(total / pageSize))}
              </span>

              <Button
                variant="secondary"
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() =>
                  setPage((p) =>
                    Math.min(Math.ceil(total / pageSize), p + 1)
                  )
                }
              >
                Next
              </Button>

              <select
                className="border rounded px-2 py-1"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
