// =====================================================
// CAPEX BUDGET UTILITIES
// =====================================================
// Separate utilities for CAPEX budget calculations
// Similar to OPEX but uses BudgetPlanCapex model

/**
 * Calculate percentage usage from budget plan data
 */
export function calculatePercentage(
  realisasi: bigint | number,
  budget: bigint | number
): number {
  const real = Number(realisasi);
  const budg = Number(budget);
  if (budg === 0) return 0;
  return (real / budg) * 100;
}

/**
 * Get status category based on percentage
 * 
 * CAPEX Rules (same as OPEX):
 * - On Track: <80%
 * - Warning / On Budget: 80-100%
 * - Over Budget: >100%
 */
export function getStatusCategory(
  percentage: number
): "onTrack" | "warning" | "overBudget" {
  if (percentage > 100) return "overBudget"; // Only >100% is over budget
  if (percentage >= 80) return "warning";     // 80-100% is warning/on budget
  return "onTrack";                           // <80% is on track
}

/**
 * Calculate distribution data from CAPEX budget plans
 * 
 * @param budgetPlans - Array of BudgetPlanCapex records
 * @returns Array of distribution data for charts
 */
export function calculateDistributionData(budgetPlans: any[]) {
  return budgetPlans.map((plan) => {
    const percentage = calculatePercentage(
      plan.budgetRealisasiAmount,
      plan.budgetPlanAmount
    );

    return {
      budgetId: plan.budgetDisplayId,      // CA-250001 format
      itemCode: plan.itemCode,             // TEST-001
      itemDescription: plan.itemDescription, // Description
      totalBudget: Number(plan.budgetPlanAmount),
      realisasi: Number(plan.budgetRealisasiAmount),
      percentage: percentage,
    };
  });
}

/**
 * Calculate status summary from CAPEX budget plans
 */
export function calculateStatusData(budgetPlans: any[]) {
  let onTrack = 0;
  let warning = 0;
  let overBudget = 0;

  budgetPlans.forEach((plan) => {
    const percentage = calculatePercentage(
      plan.budgetRealisasiAmount,
      plan.budgetPlanAmount
    );

    const status = getStatusCategory(percentage);

    if (status === "onTrack") onTrack++;
    else if (status === "warning") warning++;
    else if (status === "overBudget") overBudget++;
  });

  return {
    onTrack,
    warning,
    overBudget,
    total: budgetPlans.length,
  };
}

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export type DistributionChartData = {
  budgetId: string;           // CA-250001
  itemCode: string;           // TEST-001
  itemDescription: string;    // Description
  totalBudget: number;
  realisasi: number;
  percentage: number;
};

export type BudgetStatusData = {
  onTrack: number;
  warning: number;
  overBudget: number;
  total: number;
};