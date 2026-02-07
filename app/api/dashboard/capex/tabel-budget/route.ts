import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =========================================================
 * GET — DASHBOARD CAPEX : TABEL BUDGET
 * =========================================================
 * READ ONLY
 * - Data baris untuk tabel Budget CAPEX
 * - Selalu scope ke TAHUN tertentu
 * - Default: tahun berjalan
 * - Support filters: budgetId, itemCode, itemDescription, noCapex, itemRemark
 */
export async function GET(request: Request) {
  try {
    // =====================================================
    // 1. Parse query params
    // =====================================================
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const budgetId = searchParams.get("budgetId");
    const itemCode = searchParams.get("itemCode");
    const itemDescription = searchParams.get("itemDescription");
    const noCapex = searchParams.get("noCapex");
    const itemRemark = searchParams.get("itemRemark");

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
      where.budgetDisplayId = budgetId.trim();
    }

    // Filter by Item Code (contains, case-insensitive)
    if (itemCode && itemCode.trim() !== "") {
      where.itemCode = {
        contains: itemCode.trim(),
        mode: "insensitive",
      };
    }

    // Filter by Item Description (contains, case-insensitive)
    if (itemDescription && itemDescription.trim() !== "") {
      where.itemDescription = {
        contains: itemDescription.trim(),
        mode: "insensitive",
      };
    }

    // Filter by No CAPEX (contains, case-insensitive)
    if (noCapex && noCapex.trim() !== "") {
      where.noCapex = {
        contains: noCapex.trim(),
        mode: "insensitive",
      };
    }

    // Filter by Item Remark (contains, case-insensitive)
    if (itemRemark && itemRemark.trim() !== "") {
      where.itemRemark = {
        contains: itemRemark.trim(),
        mode: "insensitive",
      };
    }

    // =====================================================
    // 3. Ambil Budget Plan CAPEX dengan filters
    // =====================================================
    const budgetPlans = await prisma.budgetPlanCapex.findMany({
      where,
      select: {
        id: true,
        budgetDisplayId: true,
        year: true,
        itemCode: true,
        itemDescription: true,
        noCapex: true,
        itemRemark: true,
        budgetPlanAmount: true,
      },
      orderBy: {
        budgetDisplayId: "asc",
      },
    });

    if (budgetPlans.length === 0) {
      return NextResponse.json([]);
    }

    const budgetPlanIds = budgetPlans.map((plan) => plan.id);

    // =====================================================
    // 4. Ambil total realisasi per Budget Plan
    // =====================================================
    const transactions = await prisma.transactionCapex.groupBy({
      by: ["budgetPlanCapexId"],
      where: {
        budgetPlanCapexId: {
          in: budgetPlanIds,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const usageMap = new Map<string, bigint>();

    for (const trx of transactions) {
      if (trx.budgetPlanCapexId && trx._sum.amount) {
        usageMap.set(trx.budgetPlanCapexId, trx._sum.amount);
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
        budgetId: plan.budgetDisplayId,
        budgetInternalId: plan.id,
        year: plan.year,
        itemCode: plan.itemCode,
        itemDescription: plan.itemDescription,
        noCapex: plan.noCapex || "-",
        itemRemark: plan.itemRemark || "-",
        totalBudget: Number(totalBudget),
        used: Number(used),
        remaining: Number(remaining),
        percentage,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[DASHBOARD CAPEX TABEL BUDGET ERROR]", error);

    return NextResponse.json(
      { error: "Gagal mengambil data tabel budget CAPEX" },
      { status: 500 }
    );
  }
}