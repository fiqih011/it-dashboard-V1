import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =========================================================
 * GET — FILTER OPTIONS FOR BUDGET PLAN OPEX
 * =========================================================
 * READ ONLY
 * - Ambil opsi filter dari BudgetPlanOpex
 * - Year diambil dari field year langsung (integer)
 * - Digunakan oleh BudgetPlanFilter dropdown options
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
     * 2️⃣ Ambil semua budget plan OPEX sesuai filter tahun
     * =====================================================
     */
    const budgetPlans = await prisma.budgetPlanOpex.findMany({
      where,
      select: {
        displayId: true,
        coa: true,
        category: true,
        component: true,
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
    const allYears = await prisma.budgetPlanOpex.findMany({
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
      displayIds: unique(budgetPlans.map((b) => b.displayId)),
      coas: unique(budgetPlans.map((b) => b.coa)),
      categories: unique(budgetPlans.map((b) => b.category)),
      components: unique(budgetPlans.map((b) => b.component)),
    });
  } catch (err) {
    console.error("[BUDGET OPEX FILTER OPTIONS ERROR]", err);
    return NextResponse.json(
      { error: "Gagal mengambil filter options" },
      { status: 500 }
    );
  }
}