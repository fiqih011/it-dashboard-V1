"use client";

import Button from "@/components/ui/Button";

type Props = {
  onEdit: () => void;
  onDetail: () => void;
};

export default function TransactionActionCell({
  onEdit,
  onDetail,
}: Props) {
  return (
    <div className="flex gap-2">
      <Button onClick={onEdit}>Edit</Button>
      <Button variant="secondary" onClick={onDetail}>
        Detail
      </Button>
    </div>
  );
}
