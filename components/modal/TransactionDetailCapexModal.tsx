"use client";

import { useEffect, useState } from "react";
import { X, RefreshCw, Calendar, User, Package, FileText, Hash } from "lucide-react";

type TransactionCapex = {
  id: string;
  transactionId: string;
  vendor: string;
  requester: string;
  description: string;
  amount: number;
  qty: number;
  status: string;
  submissionDate: string | null;
  approvedDate: string | null;
  deliveryStatus: string | null;
  prNumber: string | null;
  poNumber: string | null;
  projectCode: string | null;
  noUi: string | null;
  assetNumber: string | null;
};

type BudgetInfoCapex = {
  budgetId: string;
  itemCode: string;
  itemDescription: string;
  noCapex: string | null;
  totalBudget: number;
  used: number;
  remaining: number;
};

type Summary = {
  totalTransactions: number;
  totalAmount: number;
  statusBreakdown: { approved: number; pending: number; inProgress: number };
};

type Props = { open: boolean; budgetId: string; onClose: () => void };

function fmt(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function fmtDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Full Approved": "bg-emerald-50 text-emerald-700 border-emerald-200",
    Draft: "bg-slate-50 text-slate-700 border-slate-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const cls = map[status] ?? "bg-blue-50 text-blue-700 border-blue-200";
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>{status}</span>;
}

export default function TransactionDetailCapexModal({ open, budgetId, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfoCapex | null>(null);
  const [transactions, setTransactions] = useState<TransactionCapex[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    if (open && budgetId) fetchTransactions();
  }, [open, budgetId]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/capex/transactions/${budgetId}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setBudgetInfo(data.budgetInfo);
      setTransactions(data.transactions);

      // Calculate summary from transactions
      const totalAmount = data.transactions.reduce((s: number, t: TransactionCapex) => s + t.amount, 0);
      const statusCounts = data.transactions.reduce(
        (acc: any, t: TransactionCapex) => {
          if (t.status === "Approved" || t.status === "Full Approved") acc.approved++;
          else if (t.status === "Draft" || t.status === "Rejected") acc.pending++;
          else acc.inProgress++;
          return acc;
        },
        { approved: 0, pending: 0, inProgress: 0 }
      );
      setSummary({ totalTransactions: data.transactions.length, totalAmount, statusBreakdown: statusCounts });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Detail Transaksi CAPEX</h2>
            <p className="text-xs text-indigo-200 mt-0.5">Riwayat transaksi untuk budget plan ini</p>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body: 2-panel ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT — budget info panel */}
          <div className="w-52 flex-shrink-0 bg-indigo-50 border-r border-indigo-100 p-5 flex flex-col gap-4 overflow-y-auto">
            {budgetInfo ? (
              <>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-400 mb-3">Budget Info</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-indigo-400 font-medium">Budget ID</p>
                      <p className="text-sm font-bold font-mono text-gray-800">{budgetInfo.budgetId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-400 font-medium">Item Code</p>
                      <p className="text-sm font-bold font-mono text-gray-800">{budgetInfo.itemCode}</p>
                    </div>
                    {budgetInfo.noCapex && (
                      <div>
                        <p className="text-xs text-indigo-400 font-medium">No CAPEX</p>
                        <p className="text-sm font-bold font-mono text-gray-800">{budgetInfo.noCapex}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-indigo-400 font-medium">Description</p>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{budgetInfo.itemDescription}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-indigo-200 pt-4">
                  <p className="text-xs text-indigo-400 font-medium mb-1">Total Budget</p>
                  <p className="text-sm font-semibold text-gray-700">{fmt(budgetInfo.totalBudget)}</p>
                </div>

                <div className="border-t border-indigo-200 pt-4">
                  <p className="text-xs text-indigo-400 font-medium mb-1">Used</p>
                  <p className="text-sm font-semibold text-gray-700">{fmt(budgetInfo.used)}</p>
                </div>

                <div className="border-t border-indigo-200 pt-4">
                  <p className="text-xs text-indigo-400 font-medium mb-1">Remaining</p>
                  <p className={`text-base font-bold ${budgetInfo.remaining < 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {budgetInfo.remaining < 0 ? "-" : ""}{fmt(Math.abs(budgetInfo.remaining))}
                  </p>
                  {budgetInfo.remaining < 0 && <p className="text-xs text-red-500 mt-1 font-medium">⚠ Over budget</p>}
                </div>

                {summary && (
                  <div className="border-t border-indigo-200 pt-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-indigo-400">Summary</p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-indigo-400">Total Tx</span>
                        <span className="font-semibold text-gray-700">{summary.totalTransactions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-500">✓ Approved</span>
                        <span className="font-semibold text-gray-700">{summary.statusBreakdown.approved}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-500">⏳ Pending</span>
                        <span className="font-semibold text-gray-700">{summary.statusBreakdown.pending}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-500">🔄 In Progress</span>
                        <span className="font-semibold text-gray-700">{summary.statusBreakdown.inProgress}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-indigo-200">
                      <p className="text-xs text-indigo-400 font-medium mb-0.5">Total Amount</p>
                      <p className="text-sm font-bold text-gray-800">{fmt(summary.totalAmount)}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-300 border-t-indigo-600" />
              </div>
            )}
          </div>

          {/* RIGHT — transaction list */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-400 mb-3" />
                <p className="text-sm text-gray-500">Memuat data transaksi...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex items-center justify-center h-full py-16 text-sm text-gray-400">
                Belum ada transaksi untuk budget ini
              </div>
            ) : (
              <div className="p-5 space-y-3">
                {transactions.map((trx) => (
                  <div key={trx.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    {/* TX Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-900 font-mono text-sm">{trx.transactionId}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Submitted: {fmtDate(trx.submissionDate)}</p>
                      </div>
                      <StatusBadge status={trx.status} />
                    </div>

                    {/* TX Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Vendor</p>
                          <p className="font-medium text-gray-800 text-xs">{trx.vendor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Requester</p>
                          <p className="font-medium text-gray-800 text-xs">{trx.requester}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">QTY</p>
                          <p className="font-medium text-gray-800 text-xs">{trx.qty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Approved</p>
                          <p className="font-medium text-gray-800 text-xs">{fmtDate(trx.approvedDate)}</p>
                        </div>
                      </div>
                      {trx.projectCode && (
                        <div className="flex items-center gap-2">
                          <Hash className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400">Project Code</p>
                            <p className="font-medium text-gray-800 text-xs">{trx.projectCode}</p>
                          </div>
                        </div>
                      )}
                      {trx.assetNumber && (
                        <div className="flex items-center gap-2">
                          <Hash className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400">Asset Number</p>
                            <p className="font-medium text-gray-800 text-xs">{trx.assetNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="flex items-start gap-2 mb-3">
                      <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Description</p>
                        <p className="text-xs text-gray-700">{trx.description}</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="bg-indigo-50 rounded-lg px-3 py-2 border border-indigo-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-indigo-500">Amount</span>
                      <span className="text-sm font-bold text-indigo-800">{fmt(trx.amount)}</span>
                    </div>

                    {/* PR/PO/Delivery */}
                    {(trx.prNumber || trx.poNumber || trx.deliveryStatus) && (
                      <div className="mt-2 pt-2 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
                        {trx.prNumber && <span><strong>PR:</strong> {trx.prNumber}</span>}
                        {trx.poNumber && <span><strong>PO:</strong> {trx.poNumber}</span>}
                        {trx.deliveryStatus && <span><strong>Delivery:</strong> {trx.deliveryStatus}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}