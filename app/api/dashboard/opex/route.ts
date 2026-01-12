import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =========================================================
 * GET – DASHBOARD OPEX : BUDGET USAGE
 * =========================================================
 * READ ONLY
 * - Summary pemakaian budget per Budget Plan OPEX
 * - Digunakan untuk progress bar dashboard
 */
export async function GET() {
  try {
    // =====================================================
    // 1. Ambil semua Budget Plan OPEX
    // =====================================================
    const budgetPlans = await prisma.budgetPlanOpex.findMany({
      select: {
        id: true,
        displayId: true,
        component: true,
        budgetPlanAmount: true,
      },
      orderBy: {
        displayId: "asc",
      },
    });

    if (budgetPlans.length === 0) {
      return NextResponse.json([]);
    }

    // =====================================================
    // 2. Ambil total realisasi per budgetPlanOpexId
    // =====================================================
    const transactions = await prisma.transactionOpex.groupBy({
      by: ["budgetPlanOpexId"],
      _sum: {
        amount: true,
      },
    });

    // =====================================================
    // 3. Mapping realisasi ke Budget Plan
    // =====================================================
    const usageMap = new Map<string, bigint>();

    for (const trx of transactions) {
      if (trx.budgetPlanOpexId && trx._sum.amount) {
        usageMap.set(trx.budgetPlanOpexId, trx._sum.amount);
      }
    }

    // =====================================================
    // 4. Build response
    // =====================================================
    const result = budgetPlans.map((plan) => {
      const totalBudget = plan.budgetPlanAmount;
      const used = usageMap.get(plan.id) ?? BigInt(0);
      const remaining = totalBudget - used;

      // ✅ PERCENTAGE CALCULATION (BENAR)
      // percentage = (realisasi / budget) × 100
      const percentage =
        totalBudget > BigInt(0)
          ? Number((used * BigInt(100)) / totalBudget)
          : 0;

      return {
        budgetId: plan.displayId,
        name: plan.component,
        totalBudget: Number(totalBudget),
        used: Number(used),
        remaining: Number(remaining),
        percentage,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[DASHBOARD OPEX BUDGET USAGE ERROR]", error);

    return NextResponse.json(
      { error: "Gagal mengambil data dashboard OPEX" },
      { status: 500 }
    );
  }
}