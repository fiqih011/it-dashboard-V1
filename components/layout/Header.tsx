"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
      <h1 className="text-sm font-semibold text-gray-800">
        IT Budgeting Dashboard
      </h1>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <span className="text-gray-700 font-medium">
                {(session.user as any).username}
              </span>
              <span className="text-xs text-gray-400 capitalize">
                ({(session.user as any).role})
              </span>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}