import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateDistributionData,
  calculateStatusData,
} from "@/lib/capex-budget-utils";

/**
 * =========================================================
 * GET - CHARTS DATA (Dashboard CAPEX)
 * =========================================================
 * Endpoint: /api/dashboard/capex/charts/[capex]
 *
 * Params:
 * - capex (required) → No CAPEX
 *
 * Query Params:
 * - year (optional) - default: current year
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ capex: string }> }
) {
  try {
    // ✅ NEXT.JS 14/15 REQUIREMENT
    const { capex } = await context.params;

    // =====================================================
    // PARSE YEAR
    // =====================================================
    const searchParams = request.nextUrl.searchParams;
    const yearParam = searchParams.get("year");

    const year = yearParam
      ? Number(yearParam)
      : new Date().getFullYear();

    if (isNaN(year) || year < 2000 || year > 2100) {
      return NextResponse.json(
        { error: "Invalid year parameter" },
        { status: 400 }
      );
    }

    // =====================================================
    // FETCH DATA
    // =====================================================
    const budgetPlans = await prisma.budgetPlanCapex.findMany({
      where: {
        year,
        noCapex: {
          contains: capex,
          mode: "insensitive",
        },
      },
      select: {
        budgetDisplayId: true,
        itemCode: true,
        itemDescription: true,
        budgetPlanAmount: true,
        budgetRealisasiAmount: true,
        noCapex: true,
      },
      orderBy: {
        budgetRealisasiAmount: "asc",
      },
    });

    if (budgetPlans.length === 0) {
      return NextResponse.json({
        distributionData: [],
        statusData: {
          onTrack: 0,
          warning: 0,
          overBudget: 0,
          total: 0,
        },
      });
    }

    // =====================================================
    // CALCULATE
    // =====================================================
    const distributionData =
      calculateDistributionData(budgetPlans);

    const statusData =
      calculateStatusData(budgetPlans);

    return NextResponse.json({
      distributionData,
      statusData,
    });
  } catch (error) {
    console.error("[CAPEX CHARTS API ERROR]", error);

    return NextResponse.json(
      { error: "Failed to fetch CAPEX charts data" },
      { status: 500 }
    );
  }
}
