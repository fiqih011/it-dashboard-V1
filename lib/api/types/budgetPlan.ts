// lib/types/budgetPlan.ts
export type BudgetPlanRow = {
  displayId: string;
  coaOrItem: string;
  componentOrDescription: string;
  budgetPlan: string;
  budgetRealisasi: string;
  budgetRemaining: string;
};

export type BudgetPlanType = "OPEX" | "CAPEX";
