"use client";

import { SessionProvider } from "next-auth/react";
import AppLayout from "@/components/layout/AppLayout";

/**
 * ============================================
 * AUTHENTICATED LAYOUT (WITHOUT FORCE CHANGE MODAL)
 * ============================================
 * 
 * This version is for initial testing.
 * 
 * TO ADD FORCE CHANGE PASSWORD LATER:
 * 1. Create: components/modal/ForceChangePasswordModal.tsx
 * 2. Uncomment import below
 * 3. Uncomment modal component below
 */

// import ForceChangePasswordModal from "@/components/modal/ForceChangePasswordModal";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {/* 
        Force Change Password Modal 
        Uncomment when file is created:
        <ForceChangePasswordModal /> 
      */}

      {/* Main App Layout */}
      <AppLayout>{children}</AppLayout>
    </SessionProvider>
  );
}