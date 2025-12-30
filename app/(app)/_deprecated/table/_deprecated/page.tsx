"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Tabs from "@/components/table/Tabs";
import DataTable from "@/components/table/DataTable";
import PaginationBar from "@/components/table/PaginationBar";
import ActionCell from "@/components/table/ActionCell";

import BudgetPlanFilter, {
  BudgetPlanFilterValue,
} from "@/components/filter/BudgetPlanFilter";

import EditBudgetPlanModal from "@/components/modal/EditBudgetPlanModal";
import BudgetPlanDetailModal from "@/components/modal/BudgetPlanDetailModal";

import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

type BudgetPlanType = "OPEX" | "CAPEX";

/**
 * 🔒 UI Row (hasil mapping API → UI)
 */
type BudgetPlanRow = {
  displayId: string;
  coaOrItem: string;
  componentOrDescription: string;
  budgetPlan: string;
  budgetRealisasi: string;
  budgetRemaining: string;
};

export default function BudgetPlanTablePage() {
  const router = useRouter();

  // tab
  const [type, setType] = useState<BudgetPlanType>("OPEX");

  // filter
  const [filters, setFilters] = useState<BudgetPlanFilterValue>({});

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // data
  const [rows, setRows] = useState<BudgetPlanRow[]>([]);
  const [total, setTotal] = useState(0);

  // ui state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<BudgetPlanRow | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, page, pageSize]);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters.year && { year: filters.year }),
        ...(filters.id && { id: filters.id }),
        ...(filters.coaOrItem && { coa: filters.coaOrItem }),
        ...(filters.component && { component: filters.component }),
      });

      // 🔒 SESUAI API PHASE 1 (FREEZE)
      const endpoint =
        type === "OPEX" ? "/api/budget/opex" : "/api/budget/capex";

      const res = await fetch(`${endpoint}?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Gagal memuat data Budget Plan");
      }

      const json = await res.json();

      // 🔥 MAPPING FINAL (DIKUNCI)
      const mappedRows: BudgetPlanRow[] = (json.data ?? []).map(
        (item: any) => ({
          displayId: item.displayId,
          coaOrItem: type === "OPEX" ? item.coa : item.itemCode,
          componentOrDescription:
            type === "OPEX"
              ? item.component
              : item.itemDescription,
          budgetPlan: item.budgetPlanAmount,
          budgetRealisasi: item.budgetRealisasiAmount,
          budgetRemaining: item.budgetRemainingAmount,
        })
      );

      setRows(mappedRows);
      setTotal(json.total ?? 0);
    } catch (err: any) {
      setError(err.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  if (loading && rows.length === 0) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Tabel Budget Plan</h1>

      {/* TAB OPEX / CAPEX */}
      <Tabs
        value={type}
        onChange={(v: BudgetPlanType) => {
          setType(v);
          setPage(1);
        }}
      />

      {/* FILTER */}
      <BudgetPlanFilter
        value={filters}
        onSearch={(v) => {
          setFilters(v);
          setPage(1);
          fetchData();
        }}
        onReset={() => {
          setFilters({});
          setPage(1);
          fetchData();
        }}
      />

      {/* TABLE */}
      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <DataTable
            data={rows}
            columns={[
              { accessor: "displayId", header: "ID" },
              { accessor: "coaOrItem", header: "COA / Item" },
              {
                accessor: "componentOrDescription",
                header: "Component / Description",
              },
              { accessor: "budgetPlan", header: "Budget Plan" },
              {
                accessor: "budgetRealisasi",
                header: "Budget Realisasi",
              },
              {
                accessor: "budgetRemaining",
                header: "Budget Remaining",
              },
              {
                header: "Action",
                accessor: (row) => (
                  <ActionCell
                    onEdit={() => {
                      setSelectedRow(row);
                      setEditOpen(true);
                    }}
                    onInput={() => {
                      router.push(
                        `/input/transaction?type=${type}&id=${row.displayId}`
                      );
                    }}
                    onDetail={() => {
                      setSelectedRow(row);
                      setDetailOpen(true);
                    }}
                  />
                ),
              },
            ]}
          />

          <PaginationBar
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </>
      )}

      {/* MODALS */}
      {selectedRow && (
        <>
          <EditBudgetPlanModal
            open={editOpen}
            data={selectedRow}
            onClose={() => setEditOpen(false)}
            onSuccess={fetchData}
          />

          <BudgetPlanDetailModal
            open={detailOpen}
            data={selectedRow}
            transactions={[]}
            onClose={() => setDetailOpen(false)}
          />
        </>
      )}
    </div>
  );
}
