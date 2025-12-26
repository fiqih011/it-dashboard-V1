"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import Toast from "./Toast";

type ToastType = "success" | "error" | "info";

type ToastContextType = {
  showToast: (type: ToastType, message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/* ===== HOOK ===== */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
}

/* ===== PROVIDER ===== */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast type={toast.type} message={toast.message} />
        </div>
      )}
    </ToastContext.Provider>
  );
}
