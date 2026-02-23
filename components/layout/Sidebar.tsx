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
  { label: "Dashboard",       href: "/dashboard",       icon: Icons.Dashboard,  roles: ["admin", "user"] },
  { label: "Budget Plan",     href: "/budget-plan",     icon: Icons.Budget,     roles: ["admin", "user"] },
  { label: "Transactions",    href: "/transactions",    icon: Icons.Transaction, roles: ["admin", "user"] },
  { label: "User Management", href: "/user-management", icon: Icons.Users,      roles: ["admin"] },
];

export default function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userRole = (session?.user as any)?.role as Role | undefined;
  const filteredMenus = menus.filter((m) => userRole && m.roles.includes(userRole));

  if (!session) return null;

  return (
    <aside
      className={`min-h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className={`px-4 py-5 border-b border-gray-100 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="bg-indigo-600 rounded-xl p-2 flex-shrink-0">
          <Icons.Budget className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-sm font-bold text-gray-900">IT Budgeting</h1>
            <p className="text-xs text-gray-400">Dashboard System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {filteredMenus.map((menu) => {
          const active = pathname.startsWith(menu.href);
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              title={collapsed ? menu.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 pl-2"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-indigo-600" : "text-gray-400"}`} />
              {!collapsed && <span>{menu.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}