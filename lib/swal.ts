"use client";

import Swal from "sweetalert2";

export type ToastType = "success" | "error" | "warning" | "info";

// ─────────────────────────────────────────────
// TOAST — small popup di pojok kanan atas
// dipakai untuk success & info
// ─────────────────────────────────────────────
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

// ─────────────────────────────────────────────
// DIALOG — modal centered
// dipakai untuk error, warning, confirm
// ─────────────────────────────────────────────
const Dialog = Swal.mixin({
  customClass: {
    popup:
      "!rounded-2xl !shadow-2xl !border !border-gray-100 !font-sans !p-6",
    title: "!text-base !font-bold !text-gray-800 !pt-0",
    htmlContainer: "!text-sm !text-gray-500 !mt-1",
    confirmButton:
      "!rounded-lg !px-4 !py-2 !text-sm !font-semibold !shadow-sm !transition-all",
    cancelButton:
      "!rounded-lg !px-4 !py-2 !text-sm !font-semibold !shadow-sm !border !border-gray-200 !transition-all",
    icon: "!mb-3",
  },
  buttonsStyling: true,
});

// ─────────────────────────────────────────────
// useToast (backward compat)
// ─────────────────────────────────────────────
export function useToast() {
  function showToast(type: ToastType, message: string) {
    if (type === "success") { showSuccess(message); return; }
    if (type === "error")   { showError(message); return; }
    if (type === "warning") { showWarning(message); return; }
    showInfo(message);
  }
  return { showToast };
}

// ─────────────────────────────────────────────
// showSuccess — centered modal, auto-close
// ─────────────────────────────────────────────
export function showSuccess(message: string) {
  return Dialog.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    timer: 1800,
    showConfirmButton: false,
    iconColor: "#4f46e5",
  });
}

// ─────────────────────────────────────────────
// showError — modal dialog
// ─────────────────────────────────────────────
export function showError(message: string) {
  return Dialog.fire({
    icon: "error",
    title: "Terjadi Kesalahan",
    text: message,
    confirmButtonText: "OK",
    confirmButtonColor: "#4f46e5", // indigo-600
  });
}

// ─────────────────────────────────────────────
// showWarning — modal dialog
// ─────────────────────────────────────────────
export function showWarning(message: string) {
  return Dialog.fire({
    icon: "warning",
    title: "Peringatan",
    text: message,
    confirmButtonText: "OK",
    confirmButtonColor: "#4f46e5",
  });
}

// ─────────────────────────────────────────────
// showInfo — centered modal
// ─────────────────────────────────────────────
export function showInfo(message: string) {
  return Dialog.fire({
    icon: "info",
    title: "Info",
    text: message,
    confirmButtonText: "OK",
    confirmButtonColor: "#4f46e5",
  });
}

// ─────────────────────────────────────────────
// confirmDelete — modal dialog dengan indigo theme
// ─────────────────────────────────────────────
export async function confirmDelete(
  title = "Yakin ingin menghapus?",
  text = "Data akan dihapus secara permanen dan tidak bisa dikembalikan."
): Promise<boolean> {
  const result = await Dialog.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#dc2626", // red-600 — sesuai untuk destructive action
    cancelButtonColor: "#ffffff",
    reverseButtons: true,
    focusCancel: true,
  });

  return result.isConfirmed;
}

// ─────────────────────────────────────────────
// confirmAction — generic confirm (non-destructive)
// contoh: confirm submit, confirm approve
// ─────────────────────────────────────────────
export async function confirmAction(
  title: string,
  text?: string,
  confirmText = "Ya, Lanjutkan"
): Promise<boolean> {
  const result = await Dialog.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    confirmButtonColor: "#4f46e5", // indigo-600
    cancelButtonColor: "#ffffff",
    reverseButtons: true,
    focusCancel: true,
  });

  return result.isConfirmed;
}