// components/table/ScrollableTable.tsx
"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  minWidth?: number; // default aman untuk tabel besar
};

export default function ScrollableTable({
  children,
  minWidth = 1800,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth }}>{children}</div>
    </div>
  );
}
