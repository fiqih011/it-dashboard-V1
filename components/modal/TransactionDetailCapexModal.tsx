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
  statusBreakdown: {
    approved: number;
    pending: number;
    inProgress: number;
  };
};

type Props = {
  open: boolean;
  budgetId: string;
  onClose: () => void;
};

export default function TransactionDetailModalCapex({
  open,
  budgetId,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfoCapex | null>(null);
  const [transactions, setTransactions] = useState<TransactionCapex[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    if (open && budgetId) {
      fetchTransactions();
    }
  }, [open, budgetId]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      console.log("📡 Fetching CAPEX transactions for:", budgetId);
      
      const response = await fetch(
        `/api/dashboard/capex/transactions/${budgetId}` // ✅ URL match dengan [id]
      );

      console.log("📥 API Response:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      console.log("✅ Data received:", data);
      
      setBudgetInfo(data.budgetInfo);
      setTransactions(data.transactions);
      
      // Calculate summary from transactions
      const totalAmount = data.transactions.reduce(
        (sum: number, t: TransactionCapex) => sum + t.amount,
        0
      );
      
      const statusCounts = data.transactions.reduce(
        (acc: any, t: TransactionCapex) => {
          if (t.status === "Approved") acc.approved++;
          else if (t.status === "Draft" || t.status === "Rejected") acc.pending++;
          else acc.inProgress++;
          return acc;
        },
        { approved: 0, pending: 0, inProgress: 0 }
      );
      
      setSummary({
        totalTransactions: data.transactions.length,
        totalAmount,
        statusBreakdown: statusCounts,
      });
    } catch (error) {
      console.error("Error fetching CAPEX transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      Approved: "bg-green-50 text-green-700 border-green-300",
      "Full Approved": "bg-green-50 text-green-700 border-green-300",
      Draft: "bg-slate-50 text-slate-700 border-slate-300",
      Rejected: "bg-red-50 text-red-700 border-red-300",
    };

    return (
      statusMap[status] || "bg-blue-50 text-blue-700 border-blue-300"
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200">
        {/* 
          =====================================================
          HEADER
          =====================================================
        */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-5 rounded-t-2xl border-b border-slate-600">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">
                Detail Transaksi CAPEX
              </h2>
              {budgetInfo && (
                <div className="space-y-1 text-sm">
                  <p className="text-slate-200">
                    <span className="font-semibold">Budget ID:</span>{" "}
                    {budgetInfo.budgetId}
                  </p>
                  <p className="text-slate-200">
                    <span className="font-semibold">Item Code:</span>{" "}
                    <span className="font-mono">{budgetInfo.itemCode}</span>
                  </p>
                  <p className="text-slate-200">
                    <span className="font-semibold">Item:</span>{" "}
                    {budgetInfo.itemDescription}
                  </p>
                  {budgetInfo.noCapex && (
                    <p className="text-slate-200">
                      <span className="font-semibold">No CAPEX:</span>{" "}
                      {budgetInfo.noCapex}
                    </p>
                  )}
                  <div className="flex gap-4 mt-2 text-slate-100">
                    <span>
                      Budget: <strong>{formatCurrency(budgetInfo.totalBudget)}</strong>
                    </span>
                    <span>|</span>
                    <span>
                      Used: <strong>{formatCurrency(budgetInfo.used)}</strong>
                    </span>
                    <span>|</span>
                    <span>
                      Remaining:{" "}
                      <strong className={budgetInfo.remaining < 0 ? "text-red-300" : ""}>
                        {formatCurrency(budgetInfo.remaining)}
                      </strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 
          =====================================================
          BODY - SCROLLABLE
          =====================================================
        */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-slate-400 mb-3" />
              <span className="text-slate-500">Memuat data transaksi...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              Belum ada transaksi untuk budget ini
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((trx) => (
                <div
                  key={trx.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white"
                >
                  {/* Transaction Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 font-mono text-sm">
                        {trx.transactionId}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Created: {formatDate(trx.submissionDate)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                        trx.status
                      )}`}
                    >
                      {trx.status}
                    </span>
                  </div>

                  {/* Transaction Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-gray-500 text-xs">Vendor:</span>
                        <p className="font-medium text-gray-900">{trx.vendor}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-gray-500 text-xs">Requester:</span>
                        <p className="font-medium text-gray-900">{trx.requester}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-gray-500 text-xs">QTY:</span>
                        <p className="font-medium text-gray-900">{trx.qty}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-gray-500 text-xs">Approved:</span>
                        <p className="font-medium text-gray-900">
                          {formatDate(trx.approvedDate)}
                        </p>
                      </div>
                    </div>

                    {trx.projectCode && (
                      <div className="flex items-center gap-2 text-sm">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <div>
                          <span className="text-gray-500 text-xs">Project Code:</span>
                          <p className="font-medium text-gray-900">{trx.projectCode}</p>
                        </div>
                      </div>
                    )}

                    {trx.assetNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <div>
                          <span className="text-gray-500 text-xs">Asset Number:</span>
                          <p className="font-medium text-gray-900">{trx.assetNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="flex items-start gap-2 text-sm mb-3">
                    <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-gray-500 text-xs">Description:</span>
                      <p className="text-gray-900">{trx.description}</p>
                    </div>
                  </div>

                  {/* Amount - Highlight */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Amount
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        {formatCurrency(trx.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Additional Info (PR/PO/Delivery) */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
                    {trx.prNumber && (
                      <span>
                        <strong>PR:</strong> {trx.prNumber}
                      </span>
                    )}
                    {trx.poNumber && (
                      <span>
                        <strong>PO:</strong> {trx.poNumber}
                      </span>
                    )}
                    {trx.deliveryStatus && (
                      <span>
                        <strong>Delivery:</strong> {trx.deliveryStatus}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 
          =====================================================
          FOOTER - SUMMARY
          =====================================================
        */}
        {!loading && summary && (
          <div className="bg-slate-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-6">
                <span className="text-gray-700">
                  <strong className="text-gray-900">{summary.totalTransactions}</strong>{" "}
                  Transaksi
                </span>
                <span className="text-gray-700">
                  Total:{" "}
                  <strong className="text-gray-900">
                    {formatCurrency(summary.totalAmount)}
                  </strong>
                </span>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-green-700">
                  ✓ Approved: {summary.statusBreakdown.approved}
                </span>
                <span className="text-amber-700">
                  ⏳ Pending: {summary.statusBreakdown.pending}
                </span>
                <span className="text-blue-700">
                  🔄 In Progress: {summary.statusBreakdown.inProgress}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}