"use client";

import Button from "@/components/ui/Button";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
};

export default function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function getPages() {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);
    return pages;
  }

  const pages = getPages();

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm flex items-center justify-between text-sm">
      
      {/* LEFT */}
      <div className="flex items-center gap-6 text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-gray-500">entries</span>
        </div>

        <div className="text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-800">
            {startItem}–{endItem}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-800">
            {total}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`dots-${i}`}
              className="px-2 text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "primary" : "secondary"}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="secondary"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
