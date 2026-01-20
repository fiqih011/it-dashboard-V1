"use client";

import { useRouter } from "next/navigation";
import { Receipt, FileText, ArrowRight } from "lucide-react";

export default function TransactionsLandingPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Transactions
        </h1>
        <p className="text-sm text-gray-500">
          Pilih jenis transaksi yang ingin dikelola
        </p>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================= OPEX ================= */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* TOP ACCENT */}
          <div className="h-1 w-full rounded-t-xl bg-blue-600" />

          <div className="p-6 space-y-4">
            {/* ICON */}
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <Receipt className="h-5 w-5" />
            </div>

            {/* TEXT */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                OPEX
              </h2>
              <p className="text-sm text-gray-500">
                Operational Expenditure
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Catatan transaksi pengeluaran operasional
              perusahaan seperti biaya layanan, langganan,
              dan operasional harian.
            </p>

            {/* CTA */}
            <button
              onClick={() =>
                router.push("/transactions/opex")
              }
              className="inline-flex items-center gap-2 rounded-md border border-blue-300 bg-white px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              View Transactions
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================= CAPEX ================= */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* TOP ACCENT */}
          <div className="h-1 w-full rounded-t-xl bg-violet-600" />

          <div className="p-6 space-y-4">
            {/* ICON */}
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-violet-50 text-violet-600">
              <FileText className="h-5 w-5" />
            </div>

            {/* TEXT */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                CAPEX
              </h2>
              <p className="text-sm text-gray-500">
                Capital Expenditure
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Catatan transaksi aset dan investasi
              jangka panjang seperti perangkat,
              infrastruktur, dan proyek strategis.
            </p>

            {/* CTA */}
            <button
              onClick={() =>
                router.push("/transactions/capex")
              }
              className="inline-flex items-center gap-2 rounded-md border border-violet-300 bg-white px-4 py-2 text-sm text-violet-600 hover:bg-violet-50"
            >
              View Transactions
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
