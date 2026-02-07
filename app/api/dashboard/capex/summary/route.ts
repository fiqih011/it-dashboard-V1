import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { DashboardGlobalSummary } from "@/types/dashboard";

/**
 * =========================================================
 * GET - GLOBAL SUMMARY (Dashboard CAPEX)
 * =========================================================
 * Endpoint: /api/dashboard/capex/summary
 *
 * Query Params:
 * - year (optional) - default: current year
 * - noCapex (optional) - filter by No CAPEX
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // =====================================================
    // Parse Query Params
    // =====================================================
    const yearParam = searchParams.get("year");
    const noCapexParam = searchParams.get("noCapex");

    const currentYear = new Date().getFullYear();
    const year = yearParam ? Number(yearParam) : currentYear;

    if (isNaN(year) || year < 2000 || year > 2100) {
      return NextResponse.json(
        { error: "Invalid year parameter" },
        { status: 400 }
      );
    }

    // =====================================================
    // Build WHERE clause (scope only)
    // =====================================================
    const whereClause: {
      year: number;
      noCapex?: {
        contains: string;
        mode: "insensitive";
      };
    } = {
      year,
    };

    if (noCapexParam && noCapexParam.trim() !== "") {
      whereClause.noCapex = {
        contains: noCapexParam.trim(),
        mode: "insensitive",
      };
    }

    // =====================================================
    // Aggregate Budget Plans
    // =====================================================
    const budgetPlans = await prisma.budgetPlanCapex.findMany({
      where: whereClause,
      select: {
        budgetPlanAmount: true,
        budgetRealisasiAmount: true,
        budgetRemainingAmount: true,
      },
    });

    // =====================================================
    // Calculate Totals
    // =====================================================
    const count = budgetPlans.length;

    let totalBudget = BigInt(0);
    let totalRealisasi = BigInt(0);
    let totalRemaining = BigInt(0);

    for (const plan of budgetPlans) {
      totalBudget += plan.budgetPlanAmount;
      totalRealisasi += plan.budgetRealisasiAmount;
      totalRemaining += plan.budgetRemainingAmount;
    }

    const percentage =
      totalBudget > BigInt(0)
        ? Number((totalRealisasi * BigInt(100)) / totalBudget)
        : 0;

    const response: DashboardGlobalSummary = {
      year,
      totalBudget: Number(totalBudget),
      totalRealisasi: Number(totalRealisasi),
      totalRemaining: Number(totalRemaining),
      percentage: Math.round(percentage * 10) / 10,
      count,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[DASHBOARD CAPEX SUMMARY ERROR]", error);

    return NextResponse.json(
      { error: "Gagal mengambil global summary" },
      { status: 500 }
    );
  }
}