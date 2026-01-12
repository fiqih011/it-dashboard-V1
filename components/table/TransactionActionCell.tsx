"use client";

import Button from "@/components/ui/Button";
import { confirmDelete } from "@/lib/swal";

type Props = {
  onEdit: () => void;
  onDelete: () => Promise<boolean>;
};

export default function TransactionActionCell({
  onEdit,
  onDelete,
}: Props) {
  async function handleDelete() {
    const confirmed = await confirmDelete();
    if (!confirmed) return;

    await onDelete();
  }

  return (
    <div className="flex items-center justify-center gap-2 whitespace-nowrap">
      <Button
        variant="secondary"
        onClick={onEdit}
      >
        Edit
      </Button>

      <Button
        variant="danger"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
}
