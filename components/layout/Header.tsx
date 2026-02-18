"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <h1 className="text-sm font-semibold text-gray-900">
        IT Budgeting Dashboard
      </h1>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 font-medium">
                {(session.user as any).username}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                ({(session.user as any).role})
              </span>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-md hover:from-violet-700 hover:to-blue-700 transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
