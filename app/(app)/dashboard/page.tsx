"use client";

import { useRouter } from "next/navigation";
import { BarChart3, Briefcase, ArrowRight } from "lucide-react";

export default function DashboardLandingPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Select the dashboard you want to view.
        </p>
      </div>

      {/* ================= CARD GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================= OPEX ================= */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md overflow-hidden">
          {/* Accent */}
          <div className="h-1 w-full bg-blue-600" />

          <div className="p-6 space-y-4">
            {/* Icon */}
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                OPEX Dashboard
              </h2>
              <p className="text-sm text-gray-500">
                Operational Expenditure
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600">
              Overview and analysis of annual operational budgets,
              actual spending, and remaining OPEX allocation.
            </p>

            {/* CTA */}
            <button
              onClick={() => router.push("/dashboard/opex")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:from-blue-700 hover:to-blue-800"
            >
              View OPEX Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= CAPEX ================= */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md overflow-hidden">
          {/* Accent */}
          <div className="h-1 w-full bg-violet-600" />

          <div className="p-6 space-y-4">
            {/* Icon */}
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-violet-50 text-violet-600">
              <Briefcase className="w-5 h-5" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                CAPEX Dashboard
              </h2>
              <p className="text-sm text-gray-500">
                Capital Expenditure
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600">
              Overview of asset investments, CAPEX utilization,
              and long-term capital spending performance.
            </p>

            {/* CTA */}
            <button
              onClick={() => router.push("/dashboard/capex")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:from-violet-700 hover:to-purple-700"
            >
              View CAPEX Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
