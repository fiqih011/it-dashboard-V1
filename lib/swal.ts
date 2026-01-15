"use client";

import Swal from "sweetalert2";

/**
 * =====================================================
 * TYPE
 * =====================================================
 */
export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

/**
 * =====================================================
 * useToast (COMPAT LAMA & BARU)
 * =====================================================
 * Dipakai oleh:
 *   const { showToast } = useToast()
 */
export function useToast() {
  function showToast(
    type: ToastType,
    message: string
  ) {
    if (type === "success") {
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: message,
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    if (type === "error") {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: message,
      });
      return;
    }

    if (type === "warning") {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: message,
      });
      return;
    }

    Swal.fire({
      icon: "info",
      title: "Info",
      text: message,
    });
  }

  return { showToast };
}

/**
 * =====================================================
 * HELPER LANGSUNG (OPSIONAL)
 * =====================================================
 */
export function showSuccess(message: string) {
  return Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    timer: 1500,
    showConfirmButton: false,
  });
}

export function showError(message: string) {
  return Swal.fire({
    icon: "error",
    title: "Gagal",
    text: message,
  });
}

export async function confirmDelete(
  title = "Yakin ingin menghapus?",
  text = "Data akan dihapus permanen"
): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
  });

  return result.isConfirmed;
}
