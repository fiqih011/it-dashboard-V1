"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

/* ===============================
 * TYPE
 * =============================== */
export type TransactionCapexFormData = {
  transactionId?: string;
  budgetPlanCapexId?: string;

  vendor: string;
  requester: string;

  projectCode: string;
  noUi: string;
  prNumber: string;

  poType: "PO" | "NON_PO" | "";
  poNumber: string;
  documentGR: string;

  description: string;
  assetNumber: string;

  qty: number;
  amount: string;

  submissionDate: string;
  approvedDate: string;

  deliveryStatus: "Received" | "On Progress" | "Cancelled" | "";
  opexCapex: "CAPEX";

  oc: "OPEX" | "CAPEX" | "";
  ccLob: string;
  status: "Draft" | "Approved" | "Rejected" | "Full Approved" | "";
  notes: string;
};

type Props = {
  initialData?: TransactionCapexFormData;
  remainingBudget?: string; // Not used in form anymore, only in modal header
  onSubmit: (data: TransactionCapexFormData) => Promise<void>;
  onCancel?: () => void;
};

/* ===============================
 * EMPTY FORM (VALID)
 * =============================== */
const emptyForm: TransactionCapexFormData = {
  transactionId: undefined,
  budgetPlanCapexId: undefined,

  vendor: "",
  requester: "",

  projectCode: "",
  noUi: "",
  prNumber: "",

  poType: "",
  poNumber: "",
  documentGR: "",

  description: "",
  assetNumber: "",

  qty: 1,
  amount: "",

  submissionDate: "",
  approvedDate: "",

  deliveryStatus: "",
  opexCapex: "CAPEX",

  oc: "",
  ccLob: "",
  status: "",
  notes: "",
};

export default function TransactionCapexForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<TransactionCapexFormData>(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "qty" ? Number(value) : value,
    }));
  }

  async function handleSubmit() {
    if (
      !form.vendor ||
      !form.requester ||
      !form.description ||
      !form.amount ||
      !form.poType ||
      !form.deliveryStatus ||
      !form.status ||
      !form.oc
    ) {
      alert("Field wajib belum lengkap");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Vendor" name="vendor" value={form.vendor} onChange={handleChange} required />
        <Input label="Requester" name="requester" value={form.requester} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="PO / Non PO"
          name="poType"
          value={form.poType}
          onChange={handleChange}
          options={[
            { label: "PO", value: "PO" },
            { label: "Non PO", value: "NON_PO" },
          ]}
          required
        />
        <Input label="Project Code" name="projectCode" value={form.projectCode} onChange={handleChange} />
        <Input label="No UI" name="noUi" value={form.noUi} onChange={handleChange} />
        <Input label="PR Number" name="prNumber" value={form.prNumber} onChange={handleChange} />
        <Input label="PO Number" name="poNumber" value={form.poNumber} onChange={handleChange} />
        <Input label="Document GR" name="documentGR" value={form.documentGR} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="QTY" name="qty" type="number" value={form.qty} onChange={handleChange} />
        
        {/* ✅ Amount tanpa "Sisa Budget" - sudah ada di header */}
        <Input label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} required />

        <Select
          label="CAPEX / OPEX"
          name="oc"
          value={form.oc}
          onChange={handleChange}
          options={[
            { label: "CAPEX", value: "CAPEX" },
            { label: "OPEX", value: "OPEX" },
          ]}
          required
        />
        <Input label="CC / LOB" name="ccLob" value={form.ccLob} onChange={handleChange} />
      </div>

      <Textarea label="Description" name="description" value={form.description} onChange={handleChange} required />

      <div className="grid grid-cols-2 gap-4">
        <Input type="date" label="Submission Date" name="submissionDate" value={form.submissionDate} onChange={handleChange} />
        <Input type="date" label="Approved Date" name="approvedDate" value={form.approvedDate} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={[
            { label: "Draft", value: "Draft" },
            { label: "Approved", value: "Approved" },
            { label: "Rejected", value: "Rejected" },
            { label: "Full Approved", value: "Full Approved" },
          ]}
          required
        />
        <Select
          label="Delivery Status"
          name="deliveryStatus"
          value={form.deliveryStatus}
          onChange={handleChange}
          options={[
            { label: "Received", value: "Received" },
            { label: "On Progress", value: "On Progress" },
            { label: "Cancelled", value: "Cancelled" },
          ]}
          required
        />
      </div>

      <Textarea label="Notes" name="notes" value={form.notes} onChange={handleChange} />

      <div className="flex justify-end gap-3 border-t pt-4">
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

/* ===== SMALL INPUTS ===== */
function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="text-sm font-medium">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <input {...rest} className="w-full border rounded-lg px-3 py-2" />
    </div>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea {...rest} className="w-full border rounded-lg px-3 py-2" />
    </div>
  );
}

function Select({
  label,
  options,
  ...props
}: {
  label: string;
  options: { label: string; value: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="text-sm font-medium">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <select {...props} className="w-full border rounded-lg px-3 py-2">
        {props.value === "" && <option value="">-</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}