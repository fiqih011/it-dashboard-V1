"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

/* ===============================
 * TYPE
 * =============================== */
export type TransactionFormData = {
  transactionId?: string; // hanya ada di EDIT
  budgetId?: string;      // wajib ada, read-only

  vendor: string;
  requester: string;
  prNumber: string;
  poType: "PO" | "NON_PO" | "";
  poNumber: string;
  documentGR: string;

  description: string;
  qty: number;
  amount: string;

  submissionDate: string;
  approvedDate: string;
  deliveryDate: string;

  opexCapex: "OPEX" | "CAPEX" | "";  // ✅ Field baru untuk OPEX/CAPEX
  cc: string;
  coa: string;  // ✅ Field COA
  oc: string;   // ✅ Field O/C
  status: "Approved" | "Pending" | "In Progres" | "";
  notes: string;
};

type Props = {
  initialData?: TransactionFormData;
  remainingBudget?: string; // ✅ Format string dengan locale
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel?: () => void;
};

/* ===============================
 * EMPTY FORM (CREATE MODE)
 * =============================== */
const emptyForm: TransactionFormData = {
  transactionId: undefined,
  budgetId: "",

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

  opexCapex: "OPEX",  // Default OPEX
  cc: "",
  coa: "",
  oc: "",
  status: "",
  notes: "",
};

export default function TransactionForm({
  initialData,
  remainingBudget,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<TransactionFormData>(emptyForm);
  const [loading, setLoading] = useState(false);

  // mode edit jika ada transactionId
  const isEditMode = Boolean(initialData?.transactionId);

  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
    }
  }, [initialData]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

      {/* ===============================
          READ-ONLY HEADER
          =============================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transaction ID: HANYA EDIT - Otomatis dibuat saat simpan */}
        {isEditMode && (
          <Input
            label="Transaction ID"
            value={form.transactionId ?? ""}
            readOnly
          />
        )}

        {/* Budget ID: SELALU ADA - Otomatis terisi */}
        <Input
          label="Budget ID"
          value={form.budgetId ?? ""}
          readOnly
        />
      </div>

      {/* ===============================
          MAIN FORM
          =============================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Vendor" 
          name="vendor" 
          value={form.vendor} 
          onChange={handleChange}
          required
        />
        <Input 
          label="Requester" 
          name="requester" 
          value={form.requester} 
          onChange={handleChange}
          required
        />

        <Input 
          label="PR Number" 
          name="prNumber" 
          value={form.prNumber} 
          onChange={handleChange}
        />

        {/* PO / Non PO */}
        <Select
          label="PO / Non PO"
          name="poType"
          value={form.poType}
          onChange={handleChange}
          options={[
            { label: "PO", value: "PO" },
            { label: "Non PO", value: "NON_PO" },
          ]}
        />

        <Input 
          label="PO Number" 
          name="poNumber" 
          value={form.poNumber} 
          onChange={handleChange}
        />
        
        <Input 
          label="Document GR" 
          name="documentGR" 
          value={form.documentGR} 
          onChange={handleChange}
        />

        <Input 
          label="QTY" 
          name="qty" 
          type="number" 
          value={form.qty} 
          onChange={handleChange}
          min="1"
          required
        />

        {/* AMOUNT dengan info sisa budget */}
        <div>
          {remainingBudget && (
            <div className="text-xs text-orange-600 font-medium mb-1">
              💰 Sisa Budget: Rp {remainingBudget}
            </div>
          )}
          <Input
            label="Amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="Masukkan jumlah"
            required
          />
        </div>

        {/* Tanggal - boleh kosong */}
        <Input 
          label="Submission Date" 
          name="submissionDate" 
          type="date" 
          value={form.submissionDate} 
          onChange={handleChange}
        />
        
        <Input 
          label="Approved Date" 
          name="approvedDate" 
          type="date" 
          value={form.approvedDate} 
          onChange={handleChange}
        />
        
        <Input 
          label="Delivery Date" 
          name="deliveryDate" 
          type="date" 
          value={form.deliveryDate} 
          onChange={handleChange}
        />

        {/* OPEX / CAPEX */}
        <Select
          label="OPEX / CAPEX"
          name="opexCapex"
          value={form.opexCapex}
          onChange={handleChange}
          options={[
            { label: "OPEX", value: "OPEX" },
            { label: "CAPEX", value: "CAPEX" },
          ]}
          required
        />

        <Input 
          label="CC / LOB" 
          name="cc" 
          value={form.cc} 
          onChange={handleChange}
        />

        {/* COA - Field baru */}
        <Input 
          label="COA" 
          name="coa" 
          value={form.coa} 
          onChange={handleChange}
          placeholder="Contoh: 001"
          required
        />

        {/* O/C - Field baru */}
        <Input 
          label="O / C" 
          name="oc" 
          value={form.oc} 
          onChange={handleChange}
        />

        {/* STATUS */}
        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={[
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
            { label: "In Progress", value: "In Progres" },
          ]}
          required
        />
      </div>

      {/* ===============================
          TEXTAREA SECTION
          =============================== */}
      <Textarea 
        label="Description" 
        name="description" 
        value={form.description} 
        onChange={handleChange}
        rows={3}
        required
      />
      
      <Textarea 
        label="Notes" 
        name="notes" 
        value={form.notes} 
        onChange={handleChange} 
        rows={2}
        placeholder="Catatan tambahan (opsional)"
      />

      {/* ===============================
          ACTION BUTTONS
          =============================== */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </div>
  );
}

/* ===============================
 * SMALL COMPONENTS
 * =============================== */
function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }
) {
  const { label, className, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input 
        {...rest} 
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className || ''}`}
      />
    </div>
  );
}

function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }
) {
  const { label, className, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea 
        {...rest} 
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className || ''}`}
      />
    </div>
  );
}

function Select({
  label,
  options,
  required,
  ...props
}: {
  label: string;
  options: { label: string; value: string }[];
  required?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select 
        {...props} 
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">-- Pilih {label} --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}