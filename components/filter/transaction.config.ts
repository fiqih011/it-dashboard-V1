import { FilterFieldConfig } from "./types";
import { TransactionFilterValue } from "./types";

export const transactionFilterConfig: FilterFieldConfig<TransactionFilterValue>[] = [
  {
    key: "year",
    label: "Tahun",
    type: "select",
    options: [],
  },
  {
    key: "transactionDisplayId",
    label: "Transaction ID",
    type: "select",
    options: [],
  },
  {
    key: "budgetPlanDisplayId",
    label: "Budget ID",
    type: "select",
    options: [],
  },
  {
    key: "vendor",
    label: "Vendor",
    type: "select",
    options: [],
  },
  {
    key: "coa",
    label: "COA",
    type: "select",
    options: [],
  },
  {
    key: "description",
    label: "Description",
    type: "select",
    options: [],
  },
];