import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =========================================================
 * GET — DASHBOARD OPEX : TABEL BUDGET
 * =========================================================
 * READ ONLY
 * - Data baris untuk tabel Budget OPEX
 * - Selalu scope ke TAHUN tertentu
 * - Default: tahun berjalan
 * - Support filters: budgetId, coa, category, component
 */
export async function GET(request: Request) {
  try {
    // =====================================================
    // 1. Parse query params
    // =====================================================
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const budgetId = searchParams.get("budgetId");
    const coa = searchParams.get("coa");
    const category = searchParams.get("category");
    const component = searchParams.get("component");

    const year = yearParam
      ? Number(yearParam)
      : new Date().getFullYear();

    if (Number.isNaN(year)) {
      return NextResponse.json(
        { error: "Invalid year parameter" },
        { status: 400 }
      );
    }

    // =====================================================
    // 2. Build WHERE clause with filters
    // =====================================================
    const where: any = {
      year,
    };

    // Filter by Budget ID (exact match)
    if (budgetId && budgetId.trim() !== "") {
      where.displayId = budgetId.trim();
    }

    // Filter by COA (contains, case-insensitive)
    if (coa && coa.trim() !== "") {
      where.coa = {
        contains: coa.trim(),
        mode: "insensitive",
      };
    }

    // Filter by Category (component contains, case-insensitive)
    if (category && category.trim() !== "") {
      where.component = {
        contains: category.trim(),
        mode: "insensitive",
      };
    }

    // Filter by Component (component contains, case-insensitive)
    // Note: category and component use the same field
    if (component && component.trim() !== "" && !category) {
      where.component = {
        contains: component.trim(),
        mode: "insensitive",
      };
    }

    // =====================================================
    // 3. Ambil Budget Plan OPEX dengan filters
    // =====================================================
    const budgetPlans = await prisma.budgetPlanOpex.findMany({
      where,
      select: {
        id: true,
        displayId: true,
        year: true,
        coa: true,
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

    const budgetPlanIds = budgetPlans.map((plan) => plan.id);

    // =====================================================
    // 4. Ambil total realisasi per Budget Plan
    // =====================================================
    const transactions = await prisma.transactionOpex.groupBy({
      by: ["budgetPlanOpexId"],
      where: {
        budgetPlanOpexId: {
          in: budgetPlanIds,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const usageMap = new Map<string, bigint>();

    for (const trx of transactions) {
      if (trx.budgetPlanOpexId && trx._sum.amount) {
        usageMap.set(trx.budgetPlanOpexId, trx._sum.amount);
      }
    }

    // =====================================================
    // 5. Build response untuk tabel
    // =====================================================
    const result = budgetPlans.map((plan) => {
      const totalBudget = plan.budgetPlanAmount;
      const used = usageMap.get(plan.id) ?? BigInt(0);
      const remaining = totalBudget - used;

      const percentage =
        totalBudget > BigInt(0)
          ? Number((used * BigInt(100)) / totalBudget)
          : 0;

      return {
        budgetId: plan.displayId,
        budgetInternalId: plan.id,
        year: plan.year,
        coa: plan.coa,
        name: plan.component,
        totalBudget: Number(totalBudget),
        used: Number(used),
        remaining: Number(remaining),
        percentage,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[DASHBOARD OPEX TABEL BUDGET ERROR]", error);

    return NextResponse.json(
      { error: "Gagal mengambil data tabel budget OPEX" },
      { status: 500 }
    );
  }
}