import { FilterFieldConfig, TransactionFilterValue } from "./types";

/**
 * =========================================
 * TRANSACTION FILTER CONFIG
 * ✅ SEMUA FIELD = SELECT (DATA-DRIVEN)
 * =========================================
 */
export const transactionFilterConfig: FilterFieldConfig<TransactionFilterValue>[] =
  [
    {
      key: "year",
      label: "Tahun",
      type: "select",
      placeholder: "",
    },
    {
      key: "transactionDisplayId",
      label: "Transaction ID",
      type: "select",
      placeholder: "",
    },
    {
      key: "budgetPlanDisplayId",
      label: "Budget ID",
      type: "select",
      placeholder: "",
    },
    {
      key: "vendor",
      label: "Vendor",
      type: "select",
      placeholder: "",
    },
    {
      key: "requester",
      label: "Requester",
      type: "select",
      placeholder: "",
    },
    {
      key: "description",
      label: "Description",
      type: "select",
      placeholder: "",
    },
  ];