// components/layout/Header.tsx
"use client";

import { usePathname } from "next/navigation";

const TITLE_MAP: Record<string, string> = {
  "/": "Dashboard",
  "/table": "Budget Plan",
  "/table/transactions": "Transaksi",
  "/input": "Input Budget",
};

function getTitle(pathname: string) {
  if (pathname.startsWith("/table/transactions")) {
    return TITLE_MAP["/table/transactions"];
  }
  if (pathname.startsWith("/table")) {
    return TITLE_MAP["/table"];
  }
  if (pathname.startsWith("/input")) {
    return TITLE_MAP["/input"];
  }
  return TITLE_MAP["/"];
}

export default function Header() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="h-14 flex items-center border-b bg-white px-6">
      <h1 className="text-lg font-semibold text-gray-800">
        {title}
      </h1>
    </header>
  );
}
