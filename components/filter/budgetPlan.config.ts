import {
  FilterFieldConfig,
  BudgetPlanFilterValue,
} from "./types";

export const budgetPlanFilterConfig: FilterFieldConfig<BudgetPlanFilterValue>[] =
  [
    {
      key: "year",
      label: "Tahun",
      type: "text",
      placeholder: "",
    },
    {
      key: "displayId",
      label: "Budget ID",
      type: "text",
      placeholder: "",
    },
    {
      key: "coa",
      label: "COA",
      type: "text",
      placeholder: "",
    },
    {
      key: "category",
      label: "Category",
      type: "text",
      placeholder: "",
    },
    {
      key: "component",
      label: "Component",
      type: "text",
      placeholder: "",
    },
  ];
