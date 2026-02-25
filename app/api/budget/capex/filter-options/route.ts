import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =========================================================
 * GET — FILTER OPTIONS FOR BUDGET PLAN CAPEX
 * =========================================================
 * READ ONLY
 * - Ambil opsi filter dari BudgetPlanCapex
 * - Year diambil dari field year langsung (integer)
 * - Digunakan oleh BudgetPlanCapexFilter dropdown options
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get("year") ?? undefined;

    /**
     * =====================================================
     * 1️⃣ Base where clause
     * =====================================================
     */
    const where = yearParam ? { year: Number(yearParam) } : {};

    /**
     * =====================================================
     * 2️⃣ Ambil semua budget plan CAPEX sesuai filter tahun
     * =====================================================
     */
    const budgetPlans = await prisma.budgetPlanCapex.findMany({
      where,
      select: {
        budgetDisplayId: true,
        itemCode: true,
        itemDescription: true,
        noCapex: true,
        itemRemark: true,
        year: true,
      },
    });

    /**
     * =====================================================
     * 3️⃣ Helper unique
     * =====================================================
     */
    function unique(values: (string | number | null | undefined)[]) {
      return Array.from(
        new Set(
          values
            .filter((v): v is string | number => v !== null && v !== undefined)
            .map((v) => String(v).trim())
            .filter((v) => v !== "")
        )
      ).sort();
    }

    /**
     * =====================================================
     * 4️⃣ Ambil semua tahun unik (dari seluruh data)
     * =====================================================
     */
    const allYears = await prisma.budgetPlanCapex.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });

    const years = allYears.map((r) => String(r.year));

    /**
     * =====================================================
     * 5️⃣ Return structured options
     * =====================================================
     */
    return NextResponse.json({
      years,
      budgetDisplayIds: unique(budgetPlans.map((b) => b.budgetDisplayId)),
      itemCodes: unique(budgetPlans.map((b) => b.itemCode)),
      itemDescriptions: unique(budgetPlans.map((b) => b.itemDescription)),
      noCapexList: unique(budgetPlans.map((b) => b.noCapex)),
      itemRemarks: unique(budgetPlans.map((b) => b.itemRemark)),
    });
  } catch (err) {
    console.error("[BUDGET CAPEX FILTER OPTIONS ERROR]", err);
    return NextResponse.json(
      { error: "Gagal mengambil filter options" },
      { status: 500 }
    );
  }
}