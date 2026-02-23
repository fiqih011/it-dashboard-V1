"use client";

import { useEffect, useState } from "react";

export type TransactionFormData = {
  transactionId?: string;
  budgetId?: string;

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

  opexCapex: "OPEX" | "CAPEX" | "";
  cc: string;
  coa: string;

  oc: string;
  status: "Approved" | "Pending" | "In Progres" | "";
  notes: string;
};

type Props = {
  initialData?: TransactionFormData;
  remainingBudget?: string;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel?: () => void;
};

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

  opexCapex: "",
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initialData) {
      setForm(emptyForm);
      return;
    }

    if (!initialData.transactionId) {
      const { opexCapex, oc, ...rest } = initialData;
      setForm({ ...emptyForm, ...rest });
      return;
    }

    setForm({ ...emptyForm, ...initialData });
  }, [initialData]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: TransactionFormData = {
        ...form,
        oc:
          form.opexCapex === "OPEX"
            ? "OPEX"
            : form.opexCapex === "CAPEX"
            ? "CAPEX"
            : "",
      };

      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 
        =====================================================
        SECTION 1: BASIC INFORMATION
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
          Basic Information
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="vendor"
              required
              value={form.vendor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Vendor name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requester <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="requester"
              required
              value={form.requester}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Requester name"
            />
          </div>
        </div>
      </div>

      {/* 
        =====================================================
        SECTION 2: PURCHASE DOCUMENTS
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">2</span>
          Purchase Documents
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PO / Non PO <span className="text-red-500">*</span>
            </label>
            <select
              name="poType"
              required
              value={form.poType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select type</option>
              <option value="PO">PO</option>
              <option value="NON_PO">Non PO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PR Number
            </label>
            <input
              type="text"
              name="prNumber"
              value={form.prNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="PR number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PO Number
            </label>
            <input
              type="text"
              name="poNumber"
              value={form.poNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="PO number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document GR
            </label>
            <input
              type="text"
              name="documentGR"
              value={form.documentGR}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="GR number"
            />
          </div>
        </div>
      </div>

      {/* 
        =====================================================
        SECTION 3: ITEM DETAILS
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">3</span>
          Item Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Item description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QTY
              </label>
              <input
                type="number"
                name="qty"
                min="1"
                value={form.qty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
                {remainingBudget && (
                  <span className="ml-2 text-xs text-green-600 font-normal">
                    (Remaining: Rp {remainingBudget})
                  </span>
                )}
              </label>
              <input
                type="number"
                name="amount"
                required
                min="0"
                value={form.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Amount value"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 
        =====================================================
        SECTION 4: DATES & STATUS
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-sm font-bold">4</span>
          Dates & Status
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submission Date
            </label>
            <input
              type="date"
              name="submissionDate"
              value={form.submissionDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approved Date
            </label>
            <input
              type="date"
              name="approvedDate"
              value={form.approvedDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Date
            </label>
            <input
              type="date"
              name="deliveryDate"
              value={form.deliveryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              required
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="In Progres">In Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* 
        =====================================================
        SECTION 5: CLASSIFICATION
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">5</span>
          Classification
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OPEX / CAPEX <span className="text-red-500">*</span>
            </label>
            <select
              name="opexCapex"
              required
              value={form.opexCapex}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              disabled
            >
              <option value="OPEX">OPEX</option>
              <option value="CAPEX">CAPEX</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CC / LOB
            </label>
            <input
              type="text"
              name="cc"
              value={form.cc}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Cost Center / Line of Business"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              COA
            </label>
            <input
              type="text"
              name="coa"
              value={form.coa}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              placeholder="From budget"
              readOnly
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">COA is auto-filled from budget</p>
          </div>
        </div>
      </div>

      {/* 
        =====================================================
        SECTION 6: NOTES
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-bold">6</span>
          Notes
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Additional notes (optional)"
          />
        </div>
      </div>

      {/* 
        =====================================================
        ACTIONS
        =====================================================
      */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}