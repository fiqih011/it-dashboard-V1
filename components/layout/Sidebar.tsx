"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Icons } from "@/components/icons";

type Role = "admin" | "user";

interface SidebarProps {
  collapsed: boolean;
}

const menus: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Icons.Dashboard,
    roles: ["admin", "user"],
  },
  {
    label: "Budget Plan",
    href: "/budget-plan",
    icon: Icons.Budget,
    roles: ["admin", "user"],
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: Icons.Transaction,
    roles: ["admin", "user"],
  },
  {
    label: "User Management",
    href: "/user-management",
    icon: Icons.Users,
    roles: ["admin"],
  },
];

export default function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userRole = (session?.user as any)?.role as Role | undefined;

  const filteredMenus = menus.filter((menu) => {
    if (!userRole) return false;
    return menu.roles.includes(userRole);
  });

  if (!session) return null;

  return (
    <aside
      className={`min-h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-2">
            <Icons.Budget className="w-5 h-5 text-white" />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-base font-bold text-gray-900">
                IT Budgeting
              </h1>
              <p className="text-xs text-gray-500">
                Dashboard System
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {filteredMenus.map((menu) => {
          const active = pathname.startsWith(menu.href);
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-indigo-50/50"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{menu.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
