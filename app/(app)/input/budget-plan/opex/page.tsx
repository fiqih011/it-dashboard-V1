"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BudgetPlanForm from "@/components/forms/BudgetPlanForm";

export default function InputBudgetPlanOpexPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Input Budget Plan OPEX
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Gunakan form ini untuk menambahkan budget plan OPEX tahunan.
            Pastikan COA, Category, dan Component sudah sesuai standar.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <BudgetPlanForm
            mode="create"
            onSuccess={() => {
              setSubmitting(false);
              router.push("/budget-plan/opex");
            }}
            onCancel={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}
