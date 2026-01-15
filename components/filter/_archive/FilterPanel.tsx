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
  // COMMON
  year?: string;

  // TRANSACTION
  transactionId?: string;
  budgetId?: string;
  vendor?: string;
  requester?: string;
  description?: string;

  // BUDGET PLAN (LOCKED)
  status?: string;
  coa?: string;
  category?: string;
  component?: string;
};

type FilterField =
  | "year"
  | "transactionId"
  | "budgetId"
  | "vendor"
  | "requester"
  | "description"
  // budget plan only (locked behavior)
  | "status"
  | "coa"
  | "category"
  | "component";

type Props = {
  value: FilterValues;
  onChange: (value: FilterValues) => void;
  onSearch: () => void;
  onReset: () => void;
  fields?: FilterField[];
};

/**
 * ===============================
 * COMPONENT
 * ===============================
 * Reusable Filter Panel
 *
 * NOTE:
 * - Budget Plan filter behavior is LOCKED
 * - Transaction filter is controlled via `fields`
 */
export default function FilterPanel({
  value,
  onChange,
  onSearch,
  onReset,
  fields,
}: Props) {
  const visible = (f: FilterField) =>
    !fields || fields.includes(f);

  return (
    <div className="border rounded p-4 bg-white space-y-4">
      {/* FILTER FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {visible("year") && (
          <Input
            label="Tahun"
            value={value.year ?? ""}
            onChange={(v) =>
              onChange({ ...value, year: v })
            }
          />
        )}

        {visible("transactionId") && (
          <Input
            label="Transaction ID"
            value={value.transactionId ?? ""}
            onChange={(v) =>
              onChange({ ...value, transactionId: v })
            }
          />
        )}

        {visible("budgetId") && (
          <Input
            label="Budget ID"
            value={value.budgetId ?? ""}
            onChange={(v) =>
              onChange({ ...value, budgetId: v })
            }
          />
        )}

        {visible("vendor") && (
          <Input
            label="Vendor"
            value={value.vendor ?? ""}
            onChange={(v) =>
              onChange({ ...value, vendor: v })
            }
          />
        )}

        {visible("requester") && (
          <Input
            label="Requester"
            value={value.requester ?? ""}
            onChange={(v) =>
              onChange({ ...value, requester: v })
            }
          />
        )}

        {visible("description") && (
          <Input
            label="Description"
            value={value.description ?? ""}
            onChange={(v) =>
              onChange({ ...value, description: v })
            }
          />
        )}

        {/* ===== BUDGET PLAN ONLY (LOCKED) ===== */}
        {visible("status") && (
          <Select
            label="Status"
            value={value.status ?? ""}
            options={["", "OPEN", "CLOSED"]}
            onChange={(v) =>
              onChange({ ...value, status: v })
            }
          />
        )}

        {visible("coa") && (
          <Input
            label="COA"
            value={value.coa ?? ""}
            onChange={(v) =>
              onChange({ ...value, coa: v })
            }
          />
        )}

        {visible("category") && (
          <Input
            label="Category"
            value={value.category ?? ""}
            onChange={(v) =>
              onChange({ ...value, category: v })
            }
          />
        )}

        {visible("component") && (
          <Input
            label="Component"
            value={value.component ?? ""}
            onChange={(v) =>
              onChange({ ...value, component: v })
            }
          />
        )}
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
