import { FilterFieldConfig } from "./types";

/**
 * =========================================================
 * CAPEX TRANSACTION FILTER CONFIG
 * =========================================================
 * Fields aligned with TransactionCapex model
 * Different from OPEX filter!
 */

export type TransactionCapexFilterValue = {
  year?: string;
  transactionDisplayId?: string;
  budgetPlanDisplayId?: string;
  vendor?: string;
  requester?: string; // CAPEX has requester (not COA)
  description?: string;
  status?: string;
};

export const transactionCapexFilterConfig: FilterFieldConfig<TransactionCapexFilterValue>[] =
  [
    {
      key: "year",
      label: "Year",
      type: "select",
      placeholder: "Select Year",
      options: [], // Populated from API
    },
    {
      key: "transactionDisplayId",
      label: "Transaction ID",
      type: "select",
      placeholder: "Select Transaction ID",
      options: [],
    },
    {
      key: "budgetPlanDisplayId",
      label: "Budget ID",
      type: "select",
      placeholder: "Select Budget ID",
      options: [],
    },
    {
      key: "vendor",
      label: "Vendor",
      type: "select",
      placeholder: "Select Vendor",
      options: [],
    },
    {
      key: "requester",
      label: "Requester",
      type: "select",
      placeholder: "Select Requester",
      options: [],
    },
    {
      key: "description",
      label: "Description",
      type: "select",
      placeholder: "Select Description",
      options: [],
    },
  ];
