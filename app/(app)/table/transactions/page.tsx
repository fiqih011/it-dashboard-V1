// app/table/transactions/page.tsx
"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/table/DataTable";

type OpexTrx = {
  id: string;
  budgetPlanDisplayId: string;
  coa: string;
  category: string;
  component: string;
  vendor: string;
  requester: string;
  description: string;
  qty: number;
  amount: string;
  status: string;
  createdAt: string;
};

type CapexTrx = {
  id: string;
  budgetPlanDisplayId: string;
  itemCode: string;
  itemDescription: string;
  vendor: string;
  requester: string;
  description: string;
  assetNumber: string;
  qty: number;
  amount: string;
  status: string;
  createdAt: string;
};

export default function TransactionsPage() {
  const [tab, setTab] = useState<"OPEX" | "CAPEX">("OPEX");
  const [loading, setLoading] = useState(false);
  const [opex, setOpex] = useState<OpexTrx[]>([]);
  const [capex, setCapex] = useState<CapexTrx[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (tab === "OPEX") {
          const res = await fetch("/api/transaction/opex");
          const json = await res.json();
          setOpex(json.data ?? []);
        } else {
          const res = await fetch("/api/transaction/capex");
          const json = await res.json();
          setCapex(json.data ?? []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab]);

  const opexCols = [
    { header: "Budget ID", accessor: (r: OpexTrx) => r.budgetPlanDisplayId },
    { header: "COA", accessor: (r: OpexTrx) => r.coa },
    { header: "Category", accessor: (r: OpexTrx) => r.category },
    { header: "Component", accessor: (r: OpexTrx) => r.component },
    { header: "Vendor", accessor: (r: OpexTrx) => r.vendor },
    { header: "Requester", accessor: (r: OpexTrx) => r.requester },
    { header: "Desc", accessor: (r: OpexTrx) => r.description },
    { header: "Qty", accessor: (r: OpexTrx) => r.qty },
    { header: "Amount", accessor: (r: OpexTrx) => r.amount },
    { header: "Status", accessor: (r: OpexTrx) => r.status },
  ];

  const capexCols = [
    { header: "Budget ID", accessor: (r: CapexTrx) => r.budgetPlanDisplayId },
    { header: "Item Code", accessor: (r: CapexTrx) => r.itemCode },
    { header: "Item Desc", accessor: (r: CapexTrx) => r.itemDescription },
    { header: "Vendor", accessor: (r: CapexTrx) => r.vendor },
    { header: "Requester", accessor: (r: CapexTrx) => r.requester },
    { header: "Desc", accessor: (r: CapexTrx) => r.description },
    { header: "Asset No", accessor: (r: CapexTrx) => r.assetNumber },
    { header: "Qty", accessor: (r: CapexTrx) => r.qty },
    { header: "Amount", accessor: (r: CapexTrx) => r.amount },
    { header: "Status", accessor: (r: CapexTrx) => r.status },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Tabel Transaksi</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("OPEX")}
          className={`px-4 py-2 rounded ${
            tab === "OPEX" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          OPEX
        </button>
        <button
          onClick={() => setTab("CAPEX")}
          className={`px-4 py-2 rounded ${
            tab === "CAPEX" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          CAPEX
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-600">Loading...</div>
      ) : tab === "OPEX" ? (
        <DataTable columns={opexCols} data={opex} />
      ) : (
        <DataTable columns={capexCols} data={capex} />
      )}
    </div>
  );
}
