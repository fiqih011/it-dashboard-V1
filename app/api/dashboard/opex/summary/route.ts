import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { DashboardGlobalSummary } from "@/types/dashboard";

/**
 * =========================================================
 * GET - GLOBAL SUMMARY (Dashboard OPEX)
 * =========================================================
 * Endpoint: /api/dashboard/opex/summary
 * 
 * Query Params:
 * - year (optional) - default: current year
 * 
 * Response:
 * {
 *   year: number,
 *   totalBudget: number,
 *   totalRealisasi: number,
 *   totalRemaining: number,
 *   percentage: number,
 *   count: number
 * }
 * 
 * Purpose:
 * Menampilkan ringkasan total OPEX untuk tahun tertentu
 * Digunakan untuk Global Summary Cards (selalu tampil)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // =====================================================
    // Parse Query Params
    // =====================================================
    const yearParam = searchParams.get("year");
    const currentYear = new Date().getFullYear();
    const year = yearParam ? Number(yearParam) : currentYear;

    // Validate year
    if (isNaN(year) || year < 2000 || year > 2100) {
      return NextResponse.json(
        { error: "Invalid year parameter" },
        { status: 400 }
      );
    }

    // =====================================================
    // Aggregate Budget Plans untuk tahun tertentu
    // =====================================================
    const budgetPlans = await prisma.budgetPlanOpex.findMany({
      where: {
        year: year,
      },
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

    // =====================================================
    // Calculate Percentage
    // =====================================================
    const percentage =
      totalBudget > BigInt(0)
        ? Number((totalRealisasi * BigInt(100)) / totalBudget)
        : 0;

    // =====================================================
    // Build Response
    // =====================================================
    const response: DashboardGlobalSummary = {
      year,
      totalBudget: Number(totalBudget),
      totalRealisasi: Number(totalRealisasi),
      totalRemaining: Number(totalRemaining),
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
      count,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[DASHBOARD OPEX SUMMARY ERROR]", error);

    return NextResponse.json(
      { error: "Gagal mengambil global summary" },
      { status: 500 }
    );
  }
}