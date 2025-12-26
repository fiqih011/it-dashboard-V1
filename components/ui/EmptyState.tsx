"use client";

type Props = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title = "Belum ada data",
  description = "Data akan muncul setelah tersedia.",
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-gray-600">
      <div className="font-medium text-gray-800">{title}</div>
      <div className="mt-1">{description}</div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded border px-3 py-1 text-sm hover:bg-gray-50"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
