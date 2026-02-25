"use client";

import { Briefcase, CalendarDays, Tag, FileText, Hash, DollarSign, X } from "lucide-react";
import BudgetPlanCapexForm from "@/components/forms/BudgetPlanCapexForm";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateBudgetPlanCapexModal({ open, onClose, onSuccess }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Create Budget Plan CAPEX</h2>
            <p className="text-xs text-indigo-200 mt-0.5">Add capital expenditure budget plan</p>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body: 2-panel ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT — context panel */}
          <div className="w-52 flex-shrink-0 bg-indigo-50 border-r border-indigo-100 p-5 flex flex-col gap-5">
            <div>
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                <Briefcase className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">CAPEX Budget</p>
              <p className="text-xs text-indigo-400 mt-1 leading-relaxed">
                Capital expenditure for asset acquisition and long-term investments
              </p>
            </div>

            <div className="border-t border-indigo-200 pt-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-400">Required Fields</p>
              {[
                { icon: Tag, label: "Item Code" },
                { icon: FileText, label: "Item Description" },
                { icon: DollarSign, label: "Budget Amount" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs text-indigo-600 font-medium">{label}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-indigo-200 pt-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-400">Optional Fields</p>
              {[
                { icon: Hash, label: "No CAPEX" },
                { icon: FileText, label: "Item Remark" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="text-xs text-indigo-400">{label}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-indigo-200 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-400">Year</p>
              </div>
              <p className="text-xs text-indigo-600 font-semibold">{new Date().getFullYear()}</p>
              <p className="text-xs text-indigo-400 mt-0.5">Current fiscal year</p>
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <BudgetPlanCapexForm
              mode="create"
              onCancel={onClose}
              onSuccess={() => { onClose(); onSuccess(); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}