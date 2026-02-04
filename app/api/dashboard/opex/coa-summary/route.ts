import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { DashboardCoaSummary, BudgetStatus } from "@/types/dashboard";

/**
 * =========================================================
 * GET - COA SUMMARY (Dashboard OPEX)
 * =========================================================
 * Endpoint: /api/dashboard/opex/coa-summary
 * 
 * Query Params:
 * - coa (required) - kode COA
 * - year (optional) - default: current year
 * 
 * Response:
 * {
 *   coa: string,
 *   year: number,
 *   totalBudget: number,
 *   totalRealisasi: number,
 *   totalRemaining: number,
 *   percentage: number,
 *   status: "safe" | "warning" | "over",
 *   count: number
 * }
 * 
 * Purpose:
 * Menampilkan ringkasan budget untuk COA tertentu
 * Digunakan untuk COA Summary Panel (conditional - muncul saat COA dipilih)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // =====================================================
    // Parse Query Params
    // =====================================================
    const coa = searchParams.get("coa");
    const yearParam = searchParams.get("year");
    
    // Validate COA (required)
    if (!coa || coa.trim() === "") {
      return NextResponse.json(
        { error: "COA parameter is required" },
        { status: 400 }
      );
    }

    // Parse year
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
    // Aggregate Budget Plans untuk COA tertentu
    // =====================================================
    const budgetPlans = await prisma.budgetPlanOpex.findMany({
      where: {
        year: year,
        coa: {
          contains: coa,
          mode: "insensitive",
        },
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

    // Jika tidak ada data, return early
    if (count === 0) {
      return NextResponse.json(
        { error: "No budget data found for this COA" },
        { status: 404 }
      );
    }

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
    // Determine Status
    // =====================================================
    let status: BudgetStatus;

    if (percentage >= 100) {
      status = "over"; // 🔴 Over budget
    } else if (percentage >= 80) {
      status = "warning"; // 🟡 Warning (80-99%)
    } else {
      status = "safe"; // 🟢 Aman (0-79%)
    }

    // =====================================================
    // Build Response
    // =====================================================
    const response: DashboardCoaSummary = {
      coa: coa.trim(),
      year,
      totalBudget: Number(totalBudget),
      totalRealisasi: Number(totalRealisasi),
      totalRemaining: Number(totalRemaining),
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
      status,
      count,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[DASHBOARD OPEX COA-SUMMARY ERROR]", error);

    return NextResponse.json(
      { error: "Gagal mengambil COA summary" },
      { status: 500 }
    );
  }
}