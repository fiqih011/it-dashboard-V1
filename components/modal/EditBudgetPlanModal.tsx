"use client";

import Modal from "@/components/ui/Modal";
import BudgetPlanForm from "@/components/forms/BudgetPlanForm";

type Props = {
  open: boolean;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditBudgetPlanModal({
  open,
  data,
  onClose,
  onSuccess,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Edit Budget Plan">
      <BudgetPlanForm
        mode="edit"
        initialData={data}
        onSuccess={() => {
          onSuccess();
          onClose();
        }}
      />
    </Modal>
  );
}
