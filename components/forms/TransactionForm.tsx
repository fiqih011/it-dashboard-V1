"use client";

import { useEffect, useState } from "react";

export type TransactionFormData = {
  vendor: string;
  requester: string;
  prNumber: string;
  poType: string;
  poNumber: string;
  documentGR: string;
  description: string;
  qty: number;
  amount: string;
  submissionDate: string;
  approvedDate: string;
  deliveryDate: string;
  oc: string;
  cc: string;
  status: string;
  notes: string;
};

type Props = {
  initialData?: TransactionFormData;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel?: () => void;
};

const emptyForm: TransactionFormData = {
  vendor: "",
  requester: "",
  prNumber: "",
  poType: "",
  poNumber: "",
  documentGR: "",
  description: "",
  qty: 1,
  amount: "",
  submissionDate: "",
  approvedDate: "",
  deliveryDate: "",
  oc: "",
  cc: "",
  status: "",
  notes: "",
};

export default function TransactionForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<TransactionFormData>(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* GRID FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Vendor" name="vendor" value={form.vendor} onChange={handleChange} />
        <Input label="Requester" name="requester" value={form.requester} onChange={handleChange} />

        <Input label="PR Number" name="prNumber" value={form.prNumber} onChange={handleChange} />
        <Input label="PO / Non PO" name="poType" value={form.poType} onChange={handleChange} />

        <Input label="PO Number" name="poNumber" value={form.poNumber} onChange={handleChange} />
        <Input label="Document GR" name="documentGR" value={form.documentGR} onChange={handleChange} />

        <Input label="QTY" name="qty" type="number" value={form.qty} onChange={handleChange} />
        <Input label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} />

        <Input label="Submission Date" name="submissionDate" type="date" value={form.submissionDate} onChange={handleChange} />
        <Input label="Approved Date" name="approvedDate" type="date" value={form.approvedDate} onChange={handleChange} />

        <Input label="Delivery Date" name="deliveryDate" type="date" value={form.deliveryDate} onChange={handleChange} />
        <Input label="O / C" name="oc" value={form.oc} onChange={handleChange} />

        <Input label="CC / LOB" name="cc" value={form.cc} onChange={handleChange} />
        <Input label="Status" name="status" value={form.status} onChange={handleChange} />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* NOTES */}
      <div>
        <label className="block text-sm mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input {...props} className="w-full border rounded px-3 py-2" />
    </div>
  );
}
