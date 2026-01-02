import Swal from "sweetalert2";

export async function confirmDelete(
  title = "Yakin ingin menghapus?",
  text = "Data akan dihapus permanen dan budget akan dikembalikan"
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
