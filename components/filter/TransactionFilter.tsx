// components/filter/TransactionFilter.tsx
"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export type TransactionFilterValue = {
  year?: string;
  transactionId?: string;
  vendor?: string;
  coaOrItem?: string;
  status?: string;
};

type Props = {
  value: TransactionFilterValue;
  onSearch: (v: TransactionFilterValue) => void;
  onReset: () => void;
};

export default function TransactionFilter({
  value,
  onSearch,
  onReset,
}: Props) {
  return (
    <div className="rounded-md border bg-white p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <Select
          label="Tahun"
          value={value.year ?? ""}
          options={["2024", "2025", "2026"]}
          onChange={(v) =>
            onSearch({ ...value, year: v || undefined })
          }
        />

        <Input
          label="ID Transaksi"
          value={value.transactionId ?? ""}
          onChange={(v) =>
            onSearch({ ...value, transactionId: v || undefined })
          }
        />

        <Input
          label="Vendor"
          value={value.vendor ?? ""}
          onChange={(v) =>
            onSearch({ ...value, vendor: v || undefined })
          }
        />

        <Input
          label="COA / Item"
          value={value.coaOrItem ?? ""}
          onChange={(v) =>
            onSearch({ ...value, coaOrItem: v || undefined })
          }
        />

        <Select
          label="Status"
          value={value.status ?? ""}
          options={[
            "",
            "DRAFT",
            "SUBMITTED",
            "APPROVED",
            "REJECTED",
          ]}
          onChange={(v) =>
            onSearch({ ...value, status: v || undefined })
          }
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSearch(value)}>Search</Button>
        <Button
          variant="secondary"
          onClick={() => {
            onReset();
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
