"use client";

import { useState } from "react";

export type TransactionCapexFormData = {
  vendor: string;
  requester: string;
  
  projectCode: string;
  noUi: string;
  
  prNumber: string;
  poType: string;
  poNumber: string;
  documentGR: string;
  
  description: string;
  assetNumber: string;
  
  qty: number;
  amount: string;
  
  submissionDate: string;
  approvedDate: string;
  
  deliveryStatus: string;
  opexCapex: string;
  
  oc: string;
  ccLob: string;
  status: string;
  notes: string;
};

type Props = {
  initialData: TransactionCapexFormData;
  remainingBudget?: string;
  onSubmit: (data: TransactionCapexFormData) => void | Promise<void>;
  onCancel: () => void;
};

export default function TransactionCapexForm({
  initialData,
  remainingBudget,
  onSubmit,
  onCancel,
}: Props) {
  const [formData, setFormData] = useState<TransactionCapexFormData>(initialData);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(key: keyof TransactionCapexFormData, value: string | number) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
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
              required
              value={formData.vendor}
              onChange={(e) => handleChange("vendor", e.target.value)}
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
              required
              value={formData.requester}
              onChange={(e) => handleChange("requester", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Requester name"
            />
          </div>
        </div>
      </div>

      {/* 
        =====================================================
        SECTION 2: PROJECT & ASSET INFO
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">2</span>
          Project & Asset
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Code
            </label>
            <input
              type="text"
              value={formData.projectCode}
              onChange={(e) => handleChange("projectCode", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Project code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset Number
            </label>
            <input
              type="text"
              value={formData.assetNumber}
              onChange={(e) => handleChange("assetNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Asset number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No UI
            </label>
            <input
              type="text"
              value={formData.noUi}
              onChange={(e) => handleChange("noUi", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="UI number"
            />
          </div>
        </div>
      </div>

      {/* 
        =====================================================
        SECTION 3: PURCHASE DOCUMENTS
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">3</span>
          Purchase Documents
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PO / Non PO <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.poType}
              onChange={(e) => handleChange("poType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select type</option>
              <option value="PO">PO</option>
              <option value="Non PO">Non PO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PR Number
            </label>
            <input
              type="text"
              value={formData.prNumber}
              onChange={(e) => handleChange("prNumber", e.target.value)}
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
              value={formData.poNumber}
              onChange={(e) => handleChange("poNumber", e.target.value)}
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
              value={formData.documentGR}
              onChange={(e) => handleChange("documentGR", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="GR number"
            />
          </div>
        </div>
      </div>

      {/* 
        =====================================================
        SECTION 4: ITEM DETAILS
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">4</span>
          Item Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Item/asset description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QTY
              </label>
              <input
                type="number"
                min="1"
                value={formData.qty}
                onChange={(e) => handleChange("qty", Number(e.target.value))}
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
                required
                min="0"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Amount value"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 
        =====================================================
        SECTION 5: DATES & STATUS
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-sm font-bold">5</span>
          Dates & Status
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submission Date
            </label>
            <input
              type="date"
              value={formData.submissionDate}
              onChange={(e) => handleChange("submissionDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approved Date
            </label>
            <input
              type="date"
              value={formData.approvedDate}
              onChange={(e) => handleChange("approvedDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.deliveryStatus}
              onChange={(e) => handleChange("deliveryStatus", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select delivery status</option>
              <option value="On Progress">On Progress</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* 
        =====================================================
        SECTION 6: CLASSIFICATION
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">6</span>
          Classification
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CAPEX / OPEX <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.opexCapex}
              onChange={(e) => handleChange("opexCapex", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              disabled
            >
              <option value="CAPEX">CAPEX</option>
              <option value="OPEX">OPEX</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CC / LOB
            </label>
            <input
              type="text"
              value={formData.ccLob}
              onChange={(e) => handleChange("ccLob", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Cost Center / Line of Business"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              O / C
            </label>
            <input
              type="text"
              value={formData.oc}
              onChange={(e) => handleChange("oc", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="O / C"
            />
          </div>
        </div>
      </div>

      {/* 
        =====================================================
        SECTION 7: NOTES
        =====================================================
      */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-bold">7</span>
          Notes
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
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