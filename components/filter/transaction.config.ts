import { FilterFieldConfig } from "./types";
import { TransactionFilterValue } from "./types";

export const transactionFilterConfig: FilterFieldConfig<TransactionFilterValue>[] =
  [
    {
      key: "vendor",
      label: "Vendor",
      type: "text",
    },
    {
      key: "requester",
      label: "Requester",
      type: "text",
    },
    {
      key: "prNumber",
      label: "PR Number",
      type: "text",
    },
    {
      key: "poNumber",
      label: "PO Number",
      type: "text",
    },
  ];
