"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  minWidth?: number;
};

export default function ScrollableTable({
  children,
  minWidth,
}: Props) {
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <div style={minWidth ? { minWidth } : { minWidth: '100%' }}>
        {children}
      </div>
    </div>
  );
}