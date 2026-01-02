"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

/**
 * ===============================
 * TYPES
 * ===============================
 */

export type FilterValues = {
  year?: string;
  budgetId?: string;
  vendor?: string;
  status?: string;
  coa?: string;
  description?: string;
};

type Props = {
  value: FilterValues;
  onChange: (value: FilterValues) => void;
  onSearch: () => void;
  onReset: () => void;
};

/**
 * ===============================
 * COMPONENT
 * ===============================
 * Reusable filter panel for:
 * - Budget Plan
 * - Transaction OPEX
 * - Transaction CAPEX
 *
 * Tidak tahu data / API / table
 */

export default function FilterPanel({
  value,
  onChange,
  onSearch,
  onReset,
}: Props) {
  return (
    <div className="border rounded p-4 bg-white space-y-4">
      {/* FILTER FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <Input
          label="Tahun"
          value={value.year ?? ""}
          onChange={(v) =>
            onChange({ ...value, year: v })
          }
        />

        <Input
          label="Budget ID"
          value={value.budgetId ?? ""}
          onChange={(v) =>
            onChange({ ...value, budgetId: v })
          }
        />

        <Input
          label="Vendor"
          value={value.vendor ?? ""}
          onChange={(v) =>
            onChange({ ...value, vendor: v })
          }
        />

        <Select
          label="Status"
          value={value.status ?? ""}
          options={["", "OPEN", "CLOSED"]}
          onChange={(v) =>
            onChange({ ...value, status: v })
          }
        />

        <Input
          label="COA"
          value={value.coa ?? ""}
          onChange={(v) =>
            onChange({ ...value, coa: v })
          }
        />

        <Input
          label="Description"
          value={value.description ?? ""}
          onChange={(v) =>
            onChange({ ...value, description: v })
          }
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2">
        <Button variant="primary" onClick={onSearch}>
          Search
        </Button>

        <Button variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
