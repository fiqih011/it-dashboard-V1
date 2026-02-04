/**
 * =========================================================
 * DASHBOARD OPEX - TYPE DEFINITIONS
 * =========================================================
 * Shared types untuk Dashboard OPEX
 * Digunakan oleh: API routes, components, pages
 */

/**
 * =========================================================
 * FILTER TYPES
 * =========================================================
 */

/**
 * Dashboard OPEX Filter State
 */
export interface DashboardOpexFilterValue {
  year?: string;
  budgetId?: string;
  coa?: string;
  category?: string;
  component?: string;
}

/**
 * Filter Options (untuk dropdown)
 */
export interface DashboardFilterOptions {
  years: string[];
  budgetIds: string[];
  coas: string[];
  categories: string[];
  components: string[];
}

/**
 * =========================================================
 * GLOBAL SUMMARY TYPES
 * =========================================================
 */

/**
 * Global Summary Response (Total OPEX untuk tahun tertentu)
 * Digunakan oleh: /api/dashboard-opex/summary
 */
export interface DashboardGlobalSummary {
  year: number;
  totalBudget: number;
  totalRealisasi: number;
  totalRemaining: number;
  percentage: number;
  count: number; // jumlah budget plan
}

/**
 * =========================================================
 * COA SUMMARY TYPES
 * =========================================================
 */

/**
 * Status budget berdasarkan percentage
 */
export type BudgetStatus = "safe" | "warning" | "over";

/**
 * COA Summary Response (Context summary saat COA dipilih)
 * Digunakan oleh: /api/dashboard-opex/coa-summary
 */
export interface DashboardCoaSummary {
  coa: string;
  year: number;
  totalBudget: number;
  totalRealisasi: number;
  totalRemaining: number;
  percentage: number;
  status: BudgetStatus;
  count: number; // jumlah komponen dalam COA
}

/**
 * =========================================================
 * DISTRIBUTION CHART TYPES
 * =========================================================
 */

/**
 * Distribution Item (untuk barchart)
 * Digunakan oleh: /api/dashboard-opex/coa-distribution
 */
export interface DashboardDistributionItem {
  budgetId: string; // Display ID (OP-26-0001)
  component: string; // Nama komponen
  totalBudget: number;
  realisasi: number;
  remaining: number;
  percentage: number;
}

/**
 * Distribution Response (array of items)
 */
export type DashboardDistribution = DashboardDistributionItem[];

/**
 * =========================================================
 * BUDGET LIST TYPES (untuk table detail)
 * =========================================================
 */

/**
 * Budget Usage Item (existing - untuk compatibility)
 * Digunakan oleh: BudgetUsageTable component
 */
export interface BudgetUsageItem {
  budgetId: string; // Display ID
  budgetInternalId: string; // UUID untuk API call
  coa: string;
  name: string; // Component name
  totalBudget: number;
  used: number;
  remaining: number;
  percentage: number;
}

/**
 * =========================================================
 * API RESPONSE HELPERS
 * =========================================================
 */

/**
 * Generic API Response Wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  total?: number; // untuk pagination
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}