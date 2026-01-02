"use client";

type Props = {
  onEdit?: () => void;
  onInput?: () => void;
  onDetail?: () => void;
};

export default function ActionCell({
  onEdit,
  onInput,
  onDetail,
}: Props) {
  return (
    <div className="flex justify-center gap-2 whitespace-nowrap">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Edit
        </button>
      )}

      {onInput && (
        <button
          type="button"
          onClick={onInput}
          className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
        >
          Input
        </button>
      )}

      {onDetail && (
        <button
          type="button"
          onClick={onDetail}
          className="px-2 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-700"
        >
          Detail
        </button>
      )}
    </div>
  );
}
