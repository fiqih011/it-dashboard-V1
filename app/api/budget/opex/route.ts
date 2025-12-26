// app/api/budget/opex/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateBudgetDisplayId } from "@/lib/id-generator";

const prisma = new PrismaClient();

/**
 * GET /api/budget/opex
 * Read-only list Budget Plan OPEX
 */
export async function GET() {
  try {
    const rows = await prisma.budgetPlanOpex.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        displayId: true,
        year: true,
        coa: true,
        category: true,
        component: true,
        budgetPlanAmount: true,
        budgetRealisasiAmount: true,
        budgetRemainingAmount: true,
        createdAt: true,
      },
    });

    // BigInt → string (JSON safe)
    const data = rows.map((row) => ({
      ...row,
      budgetPlanAmount: row.budgetPlanAmount.toString(),
      budgetRealisasiAmount: row.budgetRealisasiAmount.toString(),
      budgetRemainingAmount: row.budgetRemainingAmount.toString(),
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET OPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data Budget Plan OPEX." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/budget/opex
 * Create Budget Plan OPEX
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      coa,
      category,
      component,
      budgetPlanAmount,
    } = body as {
      coa?: string;
      category?: string;
      component?: string;
      budgetPlanAmount?: number | string;
    };

    if (
      !coa ||
      !category ||
      !component ||
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

    const displayId = await generateBudgetDisplayId("OPEX");
    const year = new Date().getFullYear();

    const created = await prisma.budgetPlanOpex.create({
      data: {
        displayId,
        year,
        coa,
        category,
        component,
        budgetPlanAmount: planAmount,
        budgetRealisasiAmount: 0n,
        budgetRemainingAmount: planAmount,
      },
    });

    return NextResponse.json(
      {
        message: "Budget Plan OPEX berhasil dibuat.",
        data: {
          id: created.id,
          displayId: created.displayId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE OPEX ERROR:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat Budget Plan OPEX." },
      { status: 500 }
    );
  }
}
