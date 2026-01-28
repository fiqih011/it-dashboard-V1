"use client";

import { useRouter } from "next/navigation";
import { FileText, Briefcase } from "lucide-react";

export default function BudgetPlanLandingPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">
          Budget Plan
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Pilih jenis budget yang ingin dikelola
        </p>
      </div>

      {/* ================= CARD GRID ================= */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* ================= OPEX CARD ================= */}
        <div className="relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          {/* Accent bar */}
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-blue-600" />

          <div>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              OPEX
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Operational Expenditure
            </p>

            <p className="mt-4 text-sm text-gray-600">
              Budget operasional tahunan untuk kebutuhan rutin
              perusahaan seperti layanan, langganan, dan operasional
              harian.
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={() => router.push("/budget-plan/opex")}
              className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
            >
              View Budget Plan
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        {/* ================= CAPEX CARD ================= */}
        <div className="relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          {/* Accent bar */}
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-violet-600" />

          <div>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Briefcase className="h-5 w-5" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              CAPEX
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Capital Expenditure
            </p>

            <p className="mt-4 text-sm text-gray-600">
              Budget investasi aset dan pengeluaran jangka panjang
              seperti perangkat, infrastruktur, dan proyek strategis.
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={() => router.push("/budget-plan/capex")}
              className="inline-flex items-center gap-2 rounded-md border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
            >
              View Budget Plan
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
