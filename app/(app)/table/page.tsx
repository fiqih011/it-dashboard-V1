"use client";

import { useEffect, useState } from "react";
import Tabs from "@/components/table/Tabs";
import FilterPanel, { FilterState } from "@/components/table/FilterPanel";
import PaginationBar from "@/components/table/PaginationBar";
import ActionCell from "@/components/table/ActionCell";
import BudgetPlanEditModal from "@/components/forms/BudgetPlanEditModal";

type Row = {
  id: string;
  displayId: string;
  coa?: string;
  category?: string;
  component?: string;
  itemCode?: string;
  itemDescription?: string;
  itemRemark?: string;
  budgetPlanAmount: number;
};

export default function TableBudgetPlanPage() {
  const [tab, setTab] = useState<"OPEX" | "CAPEX">("OPEX");
  const [filter, setFilter] = useState<FilterState>({
    year: "",
    id: "",
    coa: "",
    component: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [editRow, setEditRow] = useState<Row | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      ...filter,
      page: String(page),
      pageSize: String(pageSize),
    });

    const res = await fetch(`/api/budget/${tab.toLowerCase()}?${params}`);
    const json = await res.json();

    setRows(json.data ?? []);
    setTotal(json.total ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, page, pageSize]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tabel Budget Plan</h1>

      <FilterPanel
        value={filter}
        onChange={setFilter}
        onSearch={() => {
          setPage(1);
          fetchData();
        }}
        onReset={() => {
          setFilter({ year: "", id: "", coa: "", component: "" });
          setPage(1);
          fetchData();
        }}
      />

      <Tabs value={tab} onChange={(v) => { setTab(v); setPage(1); }} />

      <div className="border rounded mt-2">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">{tab === "OPEX" ? "COA" : "Item Code"}</th>
              <th className="p-2 text-left">{tab === "OPEX" ? "Component" : "Description"}</th>
              <th className="p-2 text-right">Plan</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="p-4">Loading…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={5} className="p-4">No data</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.displayId}</td>
                <td className="p-2">{tab === "OPEX" ? r.coa : r.itemCode}</td>
                <td className="p-2">
                  {tab === "OPEX" ? r.component : r.itemDescription}
                </td>
                <td className="p-2 text-right">{r.budgetPlanAmount}</td>
                <td className="p-2">
                  <ActionCell
                    displayId={r.displayId}
                    type={tab.toLowerCase() as "opex" | "capex"}
                    budgetPlanId={r.id}
                    onEdit={() => setEditRow(r)}
                    onInput={() =>
                      window.location.href = `/input/transaction?type=${tab.toLowerCase()}&id=${r.id}&displayId=${r.displayId}`
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={total}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />

      {editRow && (
        <BudgetPlanEditModal
          open={true}
          onClose={() => setEditRow(null)}
          type={tab.toLowerCase() as "opex" | "capex"}
          id={editRow.id}
          initialData={editRow}
          onSaved={fetchData}
        />
      )}
    </div>
  );
}
