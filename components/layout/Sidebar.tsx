"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
};

type MenuGroup = {
  key: string;
  label: string;
  items: MenuItem[];
};

const MENU: MenuGroup[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    items: [
      { label: "OPEX", href: "/dashboard/opex" },
      // future:
      // { label: "CAPEX", href: "/dashboard/capex" },
    ],
  },
  {
    key: "budget-plan",
    label: "Tabel Budget Plan",
    items: [
      { label: "OPEX", href: "/budget-plan/opex" },
      { label: "CAPEX", href: "/budget-plan/capex" },
    ],
  },
  {
    key: "transactions",
    label: "Tabel Transaksi",
    items: [
      { label: "OPEX", href: "/transactions/opex" },
      { label: "CAPEX", href: "/transactions/capex" },
    ],
  },
  {
    key: "input",
    label: "Input",
    items: [
      { label: "Budget Plan OPEX", href: "/input/budget-plan/opex" },
      { label: "Budget Plan CAPEX", href: "/input/budget-plan/capex" },
      { label: "Transaction OPEX", href: "/input/transaction/opex" },
      { label: "Transaction CAPEX", href: "/input/transaction/capex" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // 🔹 Auto-open group jika salah satu child aktif
  useEffect(() => {
    const initialState: Record<string, boolean> = {};

    MENU.forEach((group) => {
      initialState[group.key] = group.items.some((item) =>
        isActive(pathname, item.href)
      );
    });

    setOpenGroups((prev) => ({ ...prev, ...initialState }));
  }, [pathname]);

  function toggleGroup(key: string) {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <div className="h-14 flex items-center px-4 font-bold border-b">
        IT Budgeting
      </div>

      <nav className="p-3 space-y-3 text-sm">
        {MENU.map((group) => {
          const isOpen = openGroups[group.key];

          return (
            <div key={group.key}>
              {/* Group Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.key)}
                className="flex w-full items-center justify-between rounded px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                <span>{group.label}</span>
                <span className="text-xs">{isOpen ? "▾" : "▸"}</span>
              </button>

              {/* Group Items */}
              {isOpen && (
                <div className="mt-1 space-y-1 pl-2">
                  {group.items.map((item) => {
                    const active = isActive(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block rounded px-4 py-2 transition ${
                          active
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
