import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { DashboardDistribution } from "@/types/dashboard";

/**
 * =========================================================
 * GET - COA DISTRIBUTION (Dashboard OPEX)
 * =========================================================
 * Endpoint: /api/dashboard/opex/coa-distribution
 * 
 * Query Params:
 * - coa (required) - kode COA
 * - year (optional) - default: current year
 * - limit (optional) - default: 10 (top N items)
 * 
 * Response:
 * [
 *   {
 *     budgetId: "OP-26-0001",
 *     component: "Sewa Printer",
 *     totalBudget: 1000000,
 *     realisasi: 750000,
 *     remaining: 250000,
 *     percentage: 75.0
 *   },
 *   ...
 * ]
 * 
 * Purpose:
 * Menyediakan data untuk horizontal bar chart
 * Menampilkan distribusi pemakaian budget per komponen dalam COA
 * Diurutkan dari realisasi terbesar ke terkecil
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // =====================================================
    // Parse Query Params
    // =====================================================
    const coa = searchParams.get("coa");
    const yearParam = searchParams.get("year");
    const limitParam = searchParams.get("limit");
    
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

    // Parse limit
    const limit = limitParam ? Number(limitParam) : 10;

    // Validate year
    if (isNaN(year) || year < 2000 || year > 2100) {
      return NextResponse.json(
        { error: "Invalid year parameter" },
        { status: 400 }
      );
    }

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 100" },
        { status: 400 }
      );
    }

    // =====================================================
    // Fetch Budget Plans untuk COA tertentu
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
        displayId: true,
        component: true,
        budgetPlanAmount: true,
        budgetRealisasiAmount: true,
        budgetRemainingAmount: true,
      },
      orderBy: {
        budgetRealisasiAmount: "desc", // Sort by realisasi (terbesar dulu)
      },
      take: limit, // Limit to top N
    });

    // =====================================================
    // Jika tidak ada data
    // =====================================================
    if (budgetPlans.length === 0) {
      return NextResponse.json([]);
    }

    // =====================================================
    // Build Response
    // =====================================================
    const response: DashboardDistribution = budgetPlans.map((plan) => {
      const totalBudget = Number(plan.budgetPlanAmount);
      const realisasi = Number(plan.budgetRealisasiAmount);
      const remaining = Number(plan.budgetRemainingAmount);

      // Calculate percentage
      const percentage =
        totalBudget > 0
          ? (realisasi / totalBudget) * 100
          : 0;

      return {
        budgetId: plan.displayId,
        component: plan.component,
        totalBudget,
        realisasi,
        remaining,
        percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
      };
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("[DASHBOARD OPEX COA-DISTRIBUTION ERROR]", error);

    return NextResponse.json(
      { error: "Gagal mengambil distribution data" },
      { status: 500 }
    );
  }
}