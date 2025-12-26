"use client";

import React from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  align?: "left" | "right" | "center";
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
};

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyText = "Tidak ada data",
}: Props<T>) {
  return (
    <div className="border rounded overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`p-2 text-${col.align ?? "left"} font-medium`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                Loading…
              </td>
            </tr>
          )}

          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                {emptyText}
              </td>
            </tr>
          )}

          {!loading &&
            data.map((row, ri) => (
              <tr key={ri} className="border-t">
                {columns.map((col, ci) => {
                  const value =
                    typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode);

                  return (
                    <td
                      key={ci}
                      className={`p-2 text-${col.align ?? "left"}`}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
