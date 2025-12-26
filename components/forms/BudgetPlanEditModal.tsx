"use client";

import { useState } from "react";

type OpexPayload = {
  coa: string;
  category: string;
  component: string;
  budgetPlanAmount: number;
};

type CapexPayload = {
  itemCode: string;
  itemDescription: string;
  itemRemark: string;
  budgetPlanAmount: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  type: "opex" | "capex";
  id: string;
  initialData: any;
  onSaved: () => void;
};

export default function BudgetPlanEditModal({
  open,
  onClose,
  type,
  id,
  initialData,
  onSaved,
}: Props) {
  const [form, setForm] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    const payload: OpexPayload | CapexPayload =
      type === "opex"
        ? {
            coa: form.coa,
            category: form.category,
            component: form.component,
            budgetPlanAmount: Number(form.budgetPlanAmount),
          }
        : {
            itemCode: form.itemCode,
            itemDescription: form.itemDescription,
            itemRemark: form.itemRemark,
            budgetPlanAmount: Number(form.budgetPlanAmount),
          };

    const res = await fetch(`/api/budget/${type}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Gagal menyimpan data");
      return;
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded shadow">
        <div className="px-4 py-3 border-b font-semibold text-sm">
          Edit Budget Plan ({type.toUpperCase()})
        </div>

        <div className="p-4 space-y-3 text-sm">
          {type === "opex" && (
            <>
              <Input label="COA" value={form.coa} onChange={(v) => handleChange("coa", v)} />
              <Input label="Category" value={form.category} onChange={(v) => handleChange("category", v)} />
              <Input label="Component" value={form.component} onChange={(v) => handleChange("component", v)} />
            </>
          )}

          {type === "capex" && (
            <>
              <Input label="Item Code" value={form.itemCode} onChange={(v) => handleChange("itemCode", v)} />
              <Input label="Item Description" value={form.itemDescription} onChange={(v) => handleChange("itemDescription", v)} />
              <Input label="Item Remark" value={form.itemRemark} onChange={(v) => handleChange("itemRemark", v)} />
            </>
          )}

          <Input
            label="Budget Plan"
            type="number"
            value={form.budgetPlanAmount}
            onChange={(v) => handleChange("budgetPlanAmount", v)}
          />
        </div>

        <div className="px-4 py-3 border-t flex justify-end gap-2">
          <button onClick={onClose} className="text-sm px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block mb-1 text-xs text-gray-600">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-2 py-1"
      />
    </div>
  );
}
