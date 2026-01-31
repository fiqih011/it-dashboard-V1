/* =========================================
 * BASE FILTER TYPES (LOCKED)
 * ========================================= */

export type FilterFieldType = "text" | "select";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterFieldConfig<T> = {
  key: keyof T;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: FilterOption[];
};

export type BaseFilterProps<T> = {
  value: T;
  onChange: (value: T) => void;
  onSearch: () => void;
  onReset: () => void;
};

/* =========================================
 * BUDGET PLAN FILTER — OPEX
 * ========================================= */

export type BudgetPlanFilterValue = {
  year?: string;
  displayId?: string;
  coa?: string;
  category?: string;
  component?: string;
};

/* =========================================
 * BUDGET PLAN FILTER — CAPEX
 * ========================================= */

export type BudgetPlanCapexFilterValue = {
  year?: string;
  budgetDisplayId?: string;
  itemCode?: string;
  itemDescription?: string;
  noCapex?: string;
  itemRemark?: string;
};

/* =========================================
 * TRANSACTION FILTER (OPEX & CAPEX)
 * ========================================= */

export type TransactionFilterValue = {
  year?: string;
  transactionDisplayId?: string;
  budgetPlanDisplayId?: string;
  vendor?: string;
  coa?: string;
  description?: string;
};