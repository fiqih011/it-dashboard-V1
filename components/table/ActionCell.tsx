"use client";

import { Eye, Pencil, PlusCircle, Trash2 } from "lucide-react";

type Props = {
  onDetail?: () => void;
  onEdit?: () => void;
  onInput?: () => void;
  onDelete?: () => void;
};

export default function ActionCell({ onDetail, onEdit, onInput, onDelete }: Props) {
  return (
    <div className="inline-flex items-center justify-center gap-1.5">
      {onDetail && (
        <button
          type="button"
          onClick={onDetail}
          title="View Detail"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-200 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Edit"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
      {onInput && (
        <button
          type="button"
          onClick={onInput}
          title="Input Realisasi"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition"
        >
          <PlusCircle className="h-3.5 w-3.5" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Delete"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}