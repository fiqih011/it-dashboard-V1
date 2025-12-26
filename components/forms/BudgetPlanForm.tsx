// components/forms/BudgetPlanForm.tsx
"use client";

type Props = {
  mode: "create" | "edit";
  initialData?: any;
  onSuccess: () => void;
};

export default function BudgetPlanForm({
  mode,
  initialData,
  onSuccess,
}: Props) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        BudgetPlanForm ({mode})
      </p>

      <button
        onClick={onSuccess}
        className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded"
      >
        Simpan
      </button>
    </div>
  );
}
