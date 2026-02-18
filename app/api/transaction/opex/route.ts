import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // =========================
    // PAGINATION
    // =========================
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const pageSize = Math.max(
      Number(searchParams.get("pageSize")) || 10,
      1
    );

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // =========================
    // FILTER PARAMS
    // =========================
    const year = searchParams.get("year") ?? undefined;
    const transactionId =
      searchParams.get("transactionDisplayId") ?? undefined;
    const budgetId =
      searchParams.get("budgetPlanDisplayId") ?? undefined;
    const vendor = searchParams.get("vendor") ?? undefined;
    const coa = searchParams.get("coa") ?? undefined;
    const description =
      searchParams.get("description") ?? undefined;

    /**
     * =====================================================
     * 🔥 YEAR FILTER BASED ON DISPLAY ID (NOT submissionDate)
     * =====================================================
     * TRX-OP-26-0001
     *           ^^
     */
    const yearShort = year
      ? year.slice(-2)
      : undefined;

    const where: Prisma.TransactionOpexWhereInput = {
      ...(yearShort && {
        displayId: {
          startsWith: `TRX-OP-${yearShort}-`,
        },
      }),

      ...(transactionId && {
        displayId: {
          contains: transactionId,
        },
      }),

      ...(budgetId && {
        budgetPlan: {
          displayId: {
            contains: budgetId,
          },
        },
      }),

      ...(vendor && {
        vendor: {
          contains: vendor,
          mode: Prisma.QueryMode.insensitive,
        },
      }),

      ...(coa && {
        coa: {
          contains: coa,
          mode: Prisma.QueryMode.insensitive,
        },
      }),

      ...(description && {
        description: {
          contains: description,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
    };

    // =========================
    // TOTAL COUNT
    // =========================
    const total = await prisma.transactionOpex.count({
      where,
    });

    // =========================
    // DATA
    // =========================
    const data = await prisma.transactionOpex.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        budgetPlan: {
          select: {
            displayId: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: data.map((trx) => ({
        id: trx.id,
        displayId: trx.displayId,
        budgetPlanDisplayId: trx.budgetPlan.displayId,

        vendor: trx.vendor,
        requester: trx.requester,
        prNumber: trx.prNumber,
        poType: trx.poType,
        poNumber: trx.poNumber,
        documentGr: trx.documentGr,

        description: trx.description,
        qty: trx.qty,
        amount: trx.amount.toString(),

        submissionDate: trx.submissionDate,
        approvedDate: trx.approvedDate,
        deliveryDate: trx.deliveryDate,

        oc: trx.oc,
        ccLob: trx.ccLob,
        coa: trx.coa,
        status: trx.status,
        notes: trx.notes,
      })),
      total,
    });
  } catch (err) {
    console.error("[GET TRANSACTION OPEX ERROR]", err);
    return NextResponse.json(
      { error: "Gagal mengambil data transaksi" },
      { status: 500 }
    );
  }
}
