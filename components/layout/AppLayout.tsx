"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  if (!session) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR WRAPPER */}
      <div className="relative flex flex-shrink-0">
        <Sidebar collapsed={collapsed} />

        {/* TOGGLE BUTTON */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 -right-3 z-50 bg-white border border-gray-200 rounded-full shadow-sm p-1 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
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