// app/api/budget/capex/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateBudgetDisplayId } from "@/lib/id-generator";

const prisma = new PrismaClient();

/**
 * GET /api/budget/capex
 * Read-only list Budget Plan CAPEX
 */
export async function GET() {
  try {
    const rows = await prisma.budgetPlanCapex.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        displayId: true,
        year: true,
        itemCode: true,
        itemDescription: true,
        itemRemark: true,
        budgetPlanAmount: true,
        budgetRealisasiAmount: true,
        budgetRemainingAmount: true,
        createdAt: true,
      },
    });

    const data = rows.map((row) => ({
      ...row,
      budgetPlanAmount: row.budgetPlanAmount.toString(),
      budgetRealisasiAmount: row.budgetRealisasiAmount.toString(),
      budgetRemainingAmount: row.budgetRemainingAmount.toString(),
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET CAPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data Budget Plan CAPEX." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/budget/capex
 * Create Budget Plan CAPEX
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      itemCode,
      itemDescription,
      itemRemark,
      budgetPlanAmount,
    } = body as {
      itemCode?: string;
      itemDescription?: string;
      itemRemark?: string;
      budgetPlanAmount?: number | string;
    };

    if (
      !itemCode ||
      !itemDescription ||
      budgetPlanAmount === undefined ||
      budgetPlanAmount === null
    ) {
      return NextResponse.json(
        { error: "Field wajib belum lengkap." },
        { status: 400 }
      );
    }

    const planAmount = BigInt(budgetPlanAmount);
    if (planAmount <= 0n) {
      return NextResponse.json(
        { error: "Budget plan harus lebih dari 0." },
        { status: 400 }
      );
    }

    const displayId = await generateBudgetDisplayId("CAPEX");
    const year = new Date().getFullYear();

    const created = await prisma.budgetPlanCapex.create({
      data: {
        displayId,
        year,
        itemCode,
        itemDescription,
        itemRemark: itemRemark ?? null,
        budgetPlanAmount: planAmount,
        budgetRealisasiAmount: 0n,
        budgetRemainingAmount: planAmount,
      },
    });

    return NextResponse.json(
      {
        message: "Budget Plan CAPEX berhasil dibuat.",
        data: {
          id: created.id,
          displayId: created.displayId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE CAPEX ERROR:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat Budget Plan CAPEX." },
      { status: 500 }
    );
  }
}
