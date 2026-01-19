/**
 * =========================================
 * BASE FILTER TYPES
 * =========================================
 */

export type BaseFilterProps<T> = {
  value: T;
  onChange: (value: T) => void;
  onSearch: () => void;
  onReset: () => void;
};

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

/**
 * =========================================
 * TRANSACTION FILTER VALUE
 * =========================================
 * NOTE:
 * - Semua key di sini HARUS sinkron dengan:
 *   - transaction.config.ts
 *   - query param API
 * - Optional (?) agar reset aman & tidak memaksa isi
 */

export type TransactionFilterValue = {
  year?: string;
  transactionId?: string;
  budgetId?: string;
  vendor?: string;
  requester?: string;
  description?: string;
};
