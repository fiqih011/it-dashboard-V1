import { FilterFieldConfig } from "./types";
import { TransactionFilterValue } from "./types";

/**
 * NOTE:
 * - Semua key HARUS match dengan query param API
 * - Tidak ada logic di sini (config only)
 */

export const transactionFilterConfig: FilterFieldConfig<TransactionFilterValue>[] =
  [
    {
      key: "year",
      label: "Tahun",
      type: "text",
      placeholder: "Tahun (contoh: 2025)", // ✅ FIX: String dengan quotes
    },
    {
      key: "transactionId",
      label: "Transaction ID",
      type: "text",
      placeholder: "TRX-OP-25-XXXX",
    },
    {
      key: "budgetId",
      label: "Budget ID",
      type: "text",
      placeholder: "OP-25-XXXX",
    },
    {
      key: "vendor",
      label: "Vendor",
      type: "text",
      placeholder: "Nama vendor",
    },
    {
      key: "requester",
      label: "Requester",
      type: "text",
      placeholder: "Nama requester",
    },
    {
      key: "description",
      label: "Description",
      type: "text",
      placeholder: "Deskripsi transaksi",
    },
  ];