// =====================================================
// UTILITY FUNCTIONS
// =====================================================

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
 */
export function getStatusCategory(
  percentage: number
): "onTrack" | "warning" | "overBudget" {
  if (percentage >= 100) return "overBudget";
  if (percentage >= 80) return "warning";
  return "onTrack";
}

/**
 * Calculate distribution data from budget plans
 */
export function calculateDistributionData(budgetPlans: any[]) {
  return budgetPlans.map((plan) => {
    const percentage = calculatePercentage(
      plan.budgetRealisasiAmount,
      plan.budgetPlanAmount
    );

    return {
      budgetId: plan.displayId,
      component: plan.component,
      totalBudget: Number(plan.budgetPlanAmount),
      realisasi: Number(plan.budgetRealisasiAmount),
      percentage: percentage,
    };
  });
}

/**
 * Calculate status summary from budget plans
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
// EXAMPLE: API ROUTE IMPLEMENTATION
// =====================================================

/**
 * Example API route: /api/opex/charts/[coa]
 * 
 * GET /api/opex/charts/323
 * 
 * Response:
 * {
 *   distributionData: [...],
 *   statusData: { onTrack: 4, warning: 3, overBudget: 3, total: 10 }
 * }
 */

/*
// app/api/opex/charts/[coa]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateDistributionData,
  calculateStatusData,
} from "@/lib/budget-utils";

export async function GET(
  request: Request,
  { params }: { params: { coa: string } }
) {
  try {
    const { coa } = params;

    // Fetch budget plans for this COA
    const budgetPlans = await prisma.budgetPlanOpex.findMany({
      where: {
        coa: coa,
        year: new Date().getFullYear(), // or get from query params
      },
      select: {
        displayId: true,
        component: true,
        budgetPlanAmount: true,
        budgetRealisasiAmount: true,
      },
    });

    if (budgetPlans.length === 0) {
      return NextResponse.json(
        { distributionData: [], statusData: null },
        { status: 200 }
      );
    }

    // Calculate both datasets
    const distributionData = calculateDistributionData(budgetPlans);
    const statusData = calculateStatusData(budgetPlans);

    return NextResponse.json({
      distributionData,
      statusData,
    });
  } catch (error) {
    console.error("Error fetching budget charts data:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget charts data" },
      { status: 500 }
    );
  }
}
*/

// =====================================================
// EXAMPLE: PAGE COMPONENT USAGE
// =====================================================

/*
// app/dashboard/opex/page.tsx

"use client";

import { useState, useEffect } from "react";
import OpexChartsGrid from "@/components/dashboard/opex/OpexChartsGrid";

export default function OpexDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedCoa = "323"; // or from state/props

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/opex/charts/${selectedCoa}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedCoa]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">OPEX Budget Dashboard</h1>
      
      <OpexChartsGrid
        coa={selectedCoa}
        distributionData={data?.distributionData || null}
        statusData={data?.statusData || null}
        loading={loading}
        error={error}
      />
    </div>
  );
}
*/