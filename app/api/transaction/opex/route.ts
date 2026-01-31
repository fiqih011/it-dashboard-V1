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
    // ✅ FILTER PARAMS (FIXED - MATCH CONFIG)
    // =========================
    const year = searchParams.get("year") ?? undefined;
    const transactionId = searchParams.get("transactionDisplayId") ?? undefined; // ✅ FIX
    const budgetId = searchParams.get("budgetPlanDisplayId") ?? undefined;       // ✅ FIX
    const vendor = searchParams.get("vendor") ?? undefined;
    const coa = searchParams.get("coa") ?? undefined;
    const description = searchParams.get("description") ?? undefined;

    // =========================
    // WHERE (TYPE SAFE)
    // =========================
    const where: Prisma.TransactionOpexWhereInput = {
      ...(year && {
        submissionDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
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
    // DATA (PAGINATION)
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

    // =========================
    // RESPONSE (BIGINT SAFE)
    // =========================
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
        amount: trx.amount.toString(), // ✅ FIX BIGINT

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

/**
 * =========================================================
 * POST — CREATE TRANSACTION OPEX WITH BUDGET UPDATE
 * =========================================================
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1️⃣ Validasi budget plan exists
    const budgetPlan = await prisma.budgetPlanOpex.findUnique({
      where: { displayId: body.budgetId },
      select: { 
        id: true, 
        budgetRemainingAmount: true 
      },
    });

    if (!budgetPlan) {
      return NextResponse.json(
        { error: "Budget plan tidak ditemukan" },
        { status: 404 }
      );
    }

    const amount = BigInt(body.amount);

    // ✅ OPEX: Allow over budget (budget bisa minus)
    // User tetap bisa input transaksi meskipun budget habis
    // Remaining akan otomatis jadi minus, dashboard akan show "Over Budget"

    // 3️⃣ Generate display ID (TRX-OP-YY-XXXX)
    const year = new Date().getFullYear().toString().slice(-2);
    const lastTrx = await prisma.transactionOpex.findFirst({
      where: {
        displayId: {
          startsWith: `TRX-OP-${year}-`,
        },
      },
      orderBy: {
        displayId: "desc",
      },
    });

    let nextNumber = 1;
    if (lastTrx) {
      const lastNumber = parseInt(lastTrx.displayId.split("-").pop() || "0");
      nextNumber = lastNumber + 1;
    }

    const displayId = `TRX-OP-${year}-${String(nextNumber).padStart(4, "0")}`;

    // 4️⃣ Create transaksi
    await prisma.transactionOpex.create({
      data: {
        displayId,
        budgetPlanOpexId: budgetPlan.id,
        vendor: body.vendor,
        requester: body.requester,
        prNumber: body.prNumber || null,
        poType: body.poType || null,
        poNumber: body.poNumber || null,
        documentGr: body.documentGR || null,
        description: body.description,
        qty: Number(body.qty),
        amount: amount,

        submissionDate: body.submissionDate
          ? new Date(body.submissionDate)
          : null,
        approvedDate: body.approvedDate
          ? new Date(body.approvedDate)
          : null,
        deliveryDate: body.deliveryDate
          ? new Date(body.deliveryDate)
          : null,

        oc: body.oc || null,
        ccLob: body.cc || null,
        coa: body.coa,
        status: body.status,
        notes: body.notes || null,
      },
    });

    // 5️⃣ Update budget plan
    await prisma.budgetPlanOpex.update({
      where: { id: budgetPlan.id },
      data: {
        budgetRealisasiAmount: {
          increment: amount,
        },
        budgetRemainingAmount: {
          decrement: amount,
        },
      },
    });

    return NextResponse.json({ 
      success: true,
      displayId 
    });
  } catch (err) {
    console.error("[POST TRANSACTION OPEX ERROR]", err);
    return NextResponse.json(
      { error: "Gagal membuat transaksi" },
      { status: 500 }
    );
  }
}