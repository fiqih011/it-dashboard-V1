"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Users, // ✅ TAMBAH
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menus = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Budget Plan",
    href: "/budget-plan",
    icon: Wallet,
  },
  {
    label: "Transaksi",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  // ✅ TAMBAH MENU BARU
  {
    label: "User Management",
    href: "/user-management",
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Auto collapse untuk tablet
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={`
        h-screen bg-white border-r border-gray-200
        transition-all duration-200
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        {!collapsed && (
          <span className="text-sm font-semibold text-gray-900">
            IT Budgeting
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-900"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="px-2 py-4 space-y-1">
        {menus.map((menu) => {
          const active = pathname.startsWith(menu.href);
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                ${
                  active
                    ? "bg-slate-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon size={18} />
              {!collapsed && <span>{menu.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}