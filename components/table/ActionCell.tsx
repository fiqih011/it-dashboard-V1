"use client";

import { Eye, Pencil, PlusCircle, Trash2 } from "lucide-react";

type Props = {
  onDetail?: () => void;
  onEdit?: () => void;
  onInput?: () => void;
  onDelete?: () => void;
};

export default function ActionCell({
  onDetail,
  onEdit,
  onInput,
  onDelete,
}: Props) {
  return (
    <div className="inline-flex items-center justify-center gap-2">
      {/* VIEW / DETAIL */}
      {onDetail && (
        <button
          type="button"
          onClick={onDetail}
          title="View Detail"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}

      {/* EDIT */}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Edit"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}

      {/* INPUT / REALISASI */}
      {onInput && (
        <button
          type="button"
          onClick={onInput}
          title="Input Realisasi"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition"
        >
          <PlusCircle className="h-4 w-4" />
        </button>
      )}

      {/* DELETE (opsional) */}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Delete"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
