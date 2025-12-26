// app/api/transaction/opex/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/transaction/opex
 * List transaksi OPEX
 */
export async function GET() {
  try {
    const rows = await prisma.transactionOpex.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        budgetPlan: {
          select: {
            displayId: true,
            coa: true,
            component: true,
            category: true,
          },
        },
      },
    });

    const data = rows.map((r) => ({
      id: r.id,
      budgetPlanOpexId: r.budgetPlanOpexId,
      budgetPlanDisplayId: r.budgetPlan.displayId,
      coa: r.coa,
      category: r.budgetPlan.category,
      component: r.budgetPlan.component,
      vendor: r.vendor,
      requester: r.requester,
      prNumber: r.prNumber,
      poType: r.poType,
      poNumber: r.poNumber,
      documentGr: r.documentGr,
      description: r.description,
      qty: r.qty,
      amount: r.amount.toString(),
      submissionDate: r.submissionDate,
      approvedDate: r.approvedDate,
      deliveryDate: r.deliveryDate,
      oc: r.oc,
      ccLob: r.ccLob,
      status: r.status,
      notes: r.notes,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET TRANSACTION OPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data Transaksi OPEX." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transaction/opex
 * Create transaksi OPEX + update budget plan
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      budgetPlanOpexId,
      vendor,
      requester,
      prNumber,
      poType,
      poNumber,
      documentGr,
      description,
      qty,
      amount,
      submissionDate,
      approvedDate,
      deliveryDate,
      oc,
      ccLob,
      coa,
      status,
      notes,
    } = body as any;

    if (
      !budgetPlanOpexId ||
      !vendor ||
      !requester ||
      !description ||
      !qty ||
      qty <= 0 ||
      amount === undefined ||
      amount === null
    ) {
      return NextResponse.json(
        { error: "Field wajib belum lengkap / tidak valid." },
        { status: 400 }
      );
    }

    const trxAmount = BigInt(amount);
    if (trxAmount <= 0n) {
      return NextResponse.json(
        { error: "Amount harus lebih dari 0." },
        { status: 400 }
      );
    }

    const plan = await prisma.budgetPlanOpex.findUnique({
      where: { id: budgetPlanOpexId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Budget Plan OPEX tidak ditemukan." },
        { status: 404 }
      );
    }

    if (coa && coa !== plan.coa) {
      return NextResponse.json(
        { error: "COA transaksi tidak sesuai dengan Budget Plan." },
        { status: 400 }
      );
    }

    if (plan.budgetRemainingAmount < trxAmount) {
      return NextResponse.json(
        { error: "Budget remaining tidak mencukupi." },
        { status: 400 }
      );
    }

    const created = await prisma.$transaction(async (tx) => {
      const trx = await tx.transactionOpex.create({
        data: {
          budgetPlanOpexId,
          coa: plan.coa,
          vendor,
          requester,
          prNumber,
          poType,
          poNumber,
          documentGr,
          description,
          qty,
          amount: trxAmount,
          submissionDate: submissionDate ? new Date(submissionDate) : null,
          approvedDate: approvedDate ? new Date(approvedDate) : null,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
          oc,
          ccLob,
          status: status ?? "OPEN",
          notes,
        },
      });

      await tx.budgetPlanOpex.update({
        where: { id: budgetPlanOpexId },
        data: {
          budgetRealisasiAmount: plan.budgetRealisasiAmount + trxAmount,
          budgetRemainingAmount: plan.budgetRemainingAmount - trxAmount,
        },
      });

      return trx;
    });

    return NextResponse.json(
      {
        message: "Transaksi OPEX berhasil dicatat.",
        data: {
          transactionId: created.id,
          budgetPlanOpexId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST TRANSACTION OPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mencatat transaksi OPEX." },
      { status: 500 }
    );
  }
}
