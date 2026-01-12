"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  minWidth?: number;
};

export default function TableScrollX({
  children,
  minWidth = 1600,
}: Props) {
  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <div style={{ minWidth }}>{children}</div>
      </div>
    </div>
  );
}
