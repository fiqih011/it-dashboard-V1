// components/filter/BudgetPlanFilter.tsx
"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export type BudgetPlanFilterValue = {
  year?: string;
  id?: string;
  coaOrItem?: string;
  component?: string;
};

type Props = {
  value: BudgetPlanFilterValue;
  onSearch: (v: BudgetPlanFilterValue) => void;
  onReset: () => void;
};

export default function BudgetPlanFilter({
  value,
  onSearch,
  onReset,
}: Props) {
  return (
    <div className="rounded-md border bg-white p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Select
          label="Tahun"
          value={value.year ?? ""}
          options={["2024", "2025", "2026"]}
          onChange={(v) =>
            onSearch({ ...value, year: v || undefined })
          }
        />

        <Input
          label="ID"
          value={value.id ?? ""}
          onChange={(v) =>
            onSearch({ ...value, id: v || undefined })
          }
        />

        <Input
          label="COA / Item"
          value={value.coaOrItem ?? ""}
          onChange={(v) =>
            onSearch({ ...value, coaOrItem: v || undefined })
          }
        />

        <Input
          label="Component / Description"
          value={value.component ?? ""}
          onChange={(v) =>
            onSearch({ ...value, component: v || undefined })
          }
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSearch(value)}>Search</Button>
        <Button variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
