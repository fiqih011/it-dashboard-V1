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
    <div
      className="
        w-full
        overflow-x-auto
        overflow-y-hidden
      "
    >
      {/* 
        Wrapper ini memastikan table:
        - Full width secara visual
        - Tetap bisa overflow jika minWidth > viewport
      */}
      <div className="w-full">
        <div
          className="inline-block align-top"
          style={minWidth ? { minWidth } : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
