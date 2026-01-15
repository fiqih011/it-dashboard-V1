export type FilterFieldType = "text" | "select";

export type FilterFieldConfig<T> = {
  key: keyof T;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

export type BaseFilterProps<T> = {
  value: T;
  onChange: (value: T) => void;
  onSearch: () => void;
  onReset: () => void;
};

/**
 * ============================
 * BUDGET PLAN FILTER VALUE
 * ============================
 */
export type BudgetPlanFilterValue = {
  year?: string;
  displayId?: string;
  coa?: string;
  category?: string;
  component?: string;
};

/**
 * ============================
 * TRANSACTION FILTER VALUE
 * ============================
 */
export type TransactionFilterValue = {
  vendor?: string;
  requester?: string;
  prNumber?: string;
  poNumber?: string;
};
