"use client";

import React from "react";

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
    <div className="flex justify-center gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      )}

      {onInput && (
        <button
          onClick={onInput}
          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
        >
          Input
        </button>
      )}

      {onDetail && (
        <button
          onClick={onDetail}
          className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Detail
        </button>
      )}
    </div>
  );
}
