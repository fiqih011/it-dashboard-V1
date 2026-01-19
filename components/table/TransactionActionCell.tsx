"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { confirmDelete } from "@/lib/swal";

type Props = {
  onEdit: () => void;
  onDelete: () => Promise<boolean>;
  // NOTE:
  // View tidak dipakai sekarang, tapi disiapkan kalau nanti mau aktif
  onView?: () => void;
};

export default function TransactionActionCell({
  onEdit,
  onDelete,
  onView,
}: Props) {
  async function handleDelete() {
    const confirmed = await confirmDelete();
    if (!confirmed) return;

    await onDelete();
  }

  return (
    <div className="flex items-center justify-center gap-2 whitespace-nowrap">
      {/* VIEW (OPTIONAL) */}
      {onView && (
        <Button
          variant="secondary"
          onClick={onView}
          className="px-2 py-2"
        >
          <Eye className="h-4 w-4 text-gray-600" />
        </Button>
      )}

      {/* EDIT */}
      <Button
        variant="secondary"
        onClick={onEdit}
        className="px-2 py-2"
      >
        <Pencil className="h-4 w-4 text-emerald-600" />
      </Button>

      {/* DELETE */}
      <Button
        variant="secondary"
        onClick={handleDelete}
        className="px-2 py-2"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
}
