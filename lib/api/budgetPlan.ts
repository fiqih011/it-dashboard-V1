// lib/api/budgetPlan.ts
export type FetchBudgetPlanParams = {
  type: "OPEX" | "CAPEX";
  page: number;
  pageSize: number;
  year?: string;
  id?: string;
  coa?: string;
  component?: string;
};

export async function fetchBudgetPlans(params: FetchBudgetPlanParams) {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  );

  const res = await fetch(`/api/budget/plan?${qs.toString()}`);
  if (!res.ok) {
    throw new Error("Gagal fetch Budget Plan");
  }

  return res.json();
}
