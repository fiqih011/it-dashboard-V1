"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import Button from "@/components/ui/Button";

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

            <Button
              variant="danger"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="primary">
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}