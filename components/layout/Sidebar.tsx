// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  { label: "Dashboard", href: "/" },
  { label: "Tabel Budget Plan", href: "/table" },
  { label: "Tabel Transaksi", href: "/table/transactions" },
  { label: "Input Budget", href: "/input" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <div className="h-14 flex items-center px-4 font-bold border-b">
        IT Budgeting
      </div>

      <nav className="p-2 space-y-1">
        {MENU.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded px-4 py-2 text-sm transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
