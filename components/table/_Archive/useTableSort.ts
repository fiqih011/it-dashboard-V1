// components/table/useTableSort.ts
"use client";

import { useMemo, useState } from "react";
import { SortDirection, SortState } from "./table.types";

export function useTableSort<T extends Record<string, any>>(
  data: T[],
  defaultKey?: string
) {
  const [sort, setSort] = useState<SortState>({
    key: defaultKey ?? null,
    direction: null,
  });

  function toggleSort(key: string) {
    setSort((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }

      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }

      if (prev.direction === "desc") {
        return { key: null, direction: null };
      }

      return { key, direction: "asc" };
    });
  }

  const sortedData = useMemo(() => {
    if (!sort.key || !sort.direction) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sort.key!];
      const bVal = b[sort.key!];

      if (aVal == null || bVal == null) return 0;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sort.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sort]);

  return {
    sort,
    toggleSort,
    sortedData,
  };
}
