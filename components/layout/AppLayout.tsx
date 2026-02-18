"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  if (!session) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* SIDEBAR WRAPPER */}
      <div className="relative flex">
        <Sidebar collapsed={collapsed} />

        {/* TOGGLE BUTTON (EDGE STICKY) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute top-4 -right-3 z-50 bg-white border border-gray-200 rounded-md shadow-sm p-1.5 transition-all hover:bg-gray-50`}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-700" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          )}
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
