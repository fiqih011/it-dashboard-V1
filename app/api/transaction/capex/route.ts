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
    const requester = searchParams.get("requester") ?? undefined;
    const description = searchParams.get("description") ?? undefined;

    // =========================
    // WHERE (TYPE SAFE)
    // =========================
    const where: Prisma.TransactionCapexWhereInput = {
      ...(year && {
        submissionDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      }),
      ...(transactionId && {
        transactionDisplayId: {
          contains: transactionId,
        },
      }),
      ...(budgetId && {
        budgetPlan: {
          budgetDisplayId: {
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
      ...(requester && {
        requester: {
          contains: requester,
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
    const total = await prisma.transactionCapex.count({
      where,
    });

    // =========================
    // DATA (PAGINATION)
    // =========================
    const data = await prisma.transactionCapex.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        budgetPlan: {
          select: {
            budgetDisplayId: true,
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
        transactionDisplayId: trx.transactionDisplayId,
        budgetPlanCapexId: trx.budgetPlan.budgetDisplayId,

        vendor: trx.vendor,
        requester: trx.requester,

        projectCode: trx.projectCode,
        noUi: trx.noUi,

        prNumber: trx.prNumber,
        poType: trx.poType,
        poNumber: trx.poNumber,
        documentGr: trx.documentGr,

        description: trx.description,
        qty: trx.qty,
        amount: trx.amount.toString(), // ✅ FIX BIGINT

        assetNumber: trx.assetNumber,

        submissionDate: trx.submissionDate,
        approvedDate: trx.approvedDate,
        deliveryStatus: trx.deliveryStatus,

        oc: trx.oc,
        ccLob: trx.ccLob,
        status: trx.status,
        notes: trx.notes,
      })),
      total,
    });
  } catch (err) {
    console.error("[GET TRANSACTION CAPEX ERROR]", err);
    return NextResponse.json(
      { error: "Gagal mengambil data transaksi CAPEX" },
      { status: 500 }
    );
  }
}

/**
 * =========================================================
 * POST — CREATE TRANSACTION CAPEX WITH BUDGET UPDATE
 * =========================================================
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1️⃣ Validasi budget plan exists
    const budgetPlan = await prisma.budgetPlanCapex.findUnique({
      where: { id: body.budgetPlanCapexId },
      select: { 
        id: true,
        year: true,
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

    // 2️⃣ Cek apakah budget mencukupi
    if (budgetPlan.budgetRemainingAmount < amount) {
      return NextResponse.json(
        { error: "Budget tidak mencukupi" },
        { status: 400 }
      );
    }

    // 3️⃣ Generate display ID (TRX-CA-YY-XXXX)
    // ✅ Pakai tahun SEKARANG (seperti OPEX), bukan tahun budget
    const year = new Date().getFullYear().toString().slice(-2);
    const lastTrx = await prisma.transactionCapex.findFirst({
      where: {
        transactionDisplayId: {
          startsWith: `TRX-CA-${year}-`,
        },
      },
      orderBy: {
        transactionDisplayId: "desc",
      },
    });

    let nextNumber = 1;
    if (lastTrx) {
      const lastNumber = parseInt(lastTrx.transactionDisplayId.split("-").pop() || "0");
      nextNumber = lastNumber + 1;
    }

    const transactionDisplayId = `TRX-CA-${year}-${String(nextNumber).padStart(4, "0")}`;

    // 4️⃣ Create transaksi
    await prisma.transactionCapex.create({
      data: {
        transactionDisplayId,
        budgetPlanCapexId: budgetPlan.id,

        vendor: body.vendor,
        requester: body.requester,

        projectCode: body.projectCode || null,
        noUi: body.noUi || null,

        prNumber: body.prNumber || null,
        poType: body.poType || null,
        poNumber: body.poNumber || null,
        documentGr: body.documentGR || null,

        description: body.description,
        assetNumber: body.assetNumber || null,

        qty: Number(body.qty),
        amount: amount,

        submissionDate: body.submissionDate
          ? new Date(body.submissionDate)
          : null,
        approvedDate: body.approvedDate
          ? new Date(body.approvedDate)
          : null,

        deliveryStatus: body.deliveryStatus || null,

        oc: body.oc || null,
        ccLob: body.ccLob || null,
        status: body.status,
        notes: body.notes || null,
      },
    });

    // 5️⃣ Update budget plan
    await prisma.budgetPlanCapex.update({
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
      transactionDisplayId 
    });
  } catch (err) {
    console.error("[POST TRANSACTION CAPEX ERROR]", err);
    return NextResponse.json(
      { error: "Gagal membuat transaksi" },
      { status: 500 }
    );
  }
}