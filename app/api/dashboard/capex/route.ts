import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =========================================================
 * GET – DASHBOARD CAPEX : BUDGET USAGE
 * =========================================================
 * READ ONLY
 * - Summary pemakaian budget per Budget Plan CAPEX
 * - Digunakan untuk progress bar dashboard
 */
export async function GET() {
  try {
    // =====================================================
    // 1. Ambil semua Budget Plan CAPEX
    // =====================================================
    const budgetPlans = await prisma.budgetPlanCapex.findMany({
      select: {
        id: true,                    // ✅ Internal UUID
        budgetDisplayId: true,       // ✅ Display ID (CA-250001)
        itemCode: true,
        itemDescription: true,
        noCapex: true,
        budgetPlanAmount: true,
      },
      orderBy: {
        budgetDisplayId: "asc",
      },
    });

    if (budgetPlans.length === 0) {
      return NextResponse.json([]);
    }

    // =====================================================
    // 2. Ambil total realisasi per budgetPlanCapexId
    // =====================================================
    const transactions = await prisma.transactionCapex.groupBy({
      by: ["budgetPlanCapexId"],
      _sum: {
        amount: true,
      },
    });

    // =====================================================
    // 3. Mapping realisasi ke Budget Plan
    // =====================================================
    const usageMap = new Map<string, bigint>();

    for (const trx of transactions) {
      if (trx.budgetPlanCapexId && trx._sum.amount) {
        usageMap.set(trx.budgetPlanCapexId, trx._sum.amount);
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
      const percentage =
        totalBudget > BigInt(0)
          ? Number((used * BigInt(100)) / totalBudget)
          : 0;

      return {
        budgetId: plan.budgetDisplayId,        // ✅ Display ID untuk UI (CA-250001)
        budgetInternalId: plan.id,             // ✅ UUID untuk API call
        itemCode: plan.itemCode,               // ✅ Item Code
        itemDescription: plan.itemDescription, // ✅ Item Description
        noCapex: plan.noCapex,                 // ✅ No CAPEX
        totalBudget: Number(totalBudget),
        used: Number(used),
        remaining: Number(remaining),
        percentage,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[DASHBOARD CAPEX BUDGET USAGE ERROR]", error);

    return NextResponse.json(
      { error: "Gagal mengambil data dashboard CAPEX" },
      { status: 500 }
    );
  }
}