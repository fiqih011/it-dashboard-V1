// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/dashboard
 * Summary dashboard (OPEX + CAPEX)
 */
export async function GET() {
  try {
    const [
      opexAgg,
      capexAgg,
    ] = await Promise.all([
      prisma.budgetPlanOpex.aggregate({
        _sum: {
          budgetPlanAmount: true,
          budgetRealisasiAmount: true,
          budgetRemainingAmount: true,
        },
      }),
      prisma.budgetPlanCapex.aggregate({
        _sum: {
          budgetPlanAmount: true,
          budgetRealisasiAmount: true,
          budgetRemainingAmount: true,
        },
      }),
    ]);

    const opex = {
      plan: opexAgg._sum.budgetPlanAmount ?? 0n,
      used: opexAgg._sum.budgetRealisasiAmount ?? 0n,
      remaining: opexAgg._sum.budgetRemainingAmount ?? 0n,
    };

    const capex = {
      plan: capexAgg._sum.budgetPlanAmount ?? 0n,
      used: capexAgg._sum.budgetRealisasiAmount ?? 0n,
      remaining: capexAgg._sum.budgetRemainingAmount ?? 0n,
    };

    const total = {
      plan: opex.plan + capex.plan,
      used: opex.used + capex.used,
      remaining: opex.remaining + capex.remaining,
    };

    return NextResponse.json(
      {
        opex: {
          plan: opex.plan.toString(),
          used: opex.used.toString(),
          remaining: opex.remaining.toString(),
        },
        capex: {
          plan: capex.plan.toString(),
          used: capex.used.toString(),
          remaining: capex.remaining.toString(),
        },
        total: {
          plan: total.plan.toString(),
          used: total.used.toString(),
          remaining: total.remaining.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dashboard." },
      { status: 500 }
    );
  }
}
