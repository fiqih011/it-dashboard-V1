import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =====================================================
 * HELPER — SERIALIZE BIGINT
 * =====================================================
 */
function serialize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

/**
 * =====================================================
 * GET — LIST TRANSACTION CAPEX
 * =====================================================
 * /api/transaction/capex?budgetPlanCapexId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const budgetPlanCapexId = searchParams.get("budgetPlanCapexId");

    if (!budgetPlanCapexId) {
      return NextResponse.json(
        { error: "budgetPlanCapexId wajib diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.transactionCapex.findMany({
      where: { budgetPlanCapexId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(serialize(data));
  } catch (error) {
    console.error("GET TRANSACTION CAPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil transaksi CAPEX" },
      { status: 500 }
    );
  }
}

/**
 * =====================================================
 * POST — CREATE TRANSACTION CAPEX
 * =====================================================
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      budgetPlanCapexId,
      vendor,
      requester,
      description,
      qty,
      amount,
      status,
    } = body;

    if (
      !budgetPlanCapexId ||
      !vendor ||
      !requester ||
      !description ||
      qty === undefined ||
      amount === undefined ||
      !status
    ) {
      return NextResponse.json(
        { error: "Field wajib belum lengkap" },
        { status: 400 }
      );
    }

    const plan = await prisma.budgetPlanCapex.findUnique({
      where: { id: budgetPlanCapexId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Budget Plan CAPEX tidak ditemukan" },
        { status: 404 }
      );
    }

    const trxAmount = BigInt(amount);

    if (trxAmount > plan.budgetRemainingAmount) {
      return NextResponse.json(
        { error: "Budget CAPEX tidak mencukupi" },
        { status: 400 }
      );
    }

    /**
     * =================================================
     * GENERATE TRANSACTION DISPLAY ID
     * Format: TRX-CA-YY-XXXX
     * =================================================
     */
    const yearShort = String(plan.year).slice(-2);

    const last = await prisma.transactionCapex.findFirst({
      where: {
        transactionDisplayId: { startsWith: `TRX-CA-${yearShort}` },
      },
      orderBy: { transactionDisplayId: "desc" },
      select: { transactionDisplayId: true },
    });

    const next = last
      ? Number(last.transactionDisplayId.slice(-4)) + 1
      : 1;

    const transactionDisplayId = `TRX-CA-${yearShort}-${String(next).padStart(
      4,
      "0"
    )}`;

    /**
     * =================================================
     * TRANSACTION DB (ATOMIC)
     * =================================================
     */
    const result = await prisma.$transaction(async (tx) => {
      const created = await tx.transactionCapex.create({
        data: {
          transactionDisplayId,
          budgetPlanCapexId,
          vendor,
          requester,
          description,
          qty,
          amount: trxAmount,
          status,
        },
      });

      await tx.budgetPlanCapex.update({
        where: { id: budgetPlanCapexId },
        data: {
          budgetRealisasiAmount:
            plan.budgetRealisasiAmount + trxAmount,
          budgetRemainingAmount:
            plan.budgetRemainingAmount - trxAmount,
        },
      });

      return created;
    });

    return NextResponse.json(
      serialize({
        success: true,
        id: result.id,
        transactionDisplayId: result.transactionDisplayId,
      })
    );
  } catch (error) {
    console.error("POST TRANSACTION CAPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan transaksi CAPEX" },
      { status: 500 }
    );
  }
}
