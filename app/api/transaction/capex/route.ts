// app/api/transaction/capex/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/transaction/capex
 * List transaksi CAPEX (read-only)
 */
export async function GET() {
  try {
    const rows = await prisma.transactionCapex.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        budgetPlan: {
          select: {
            displayId: true,
            itemCode: true,
            itemDescription: true,
          },
        },
      },
    });

    const data = rows.map((r) => ({
      id: r.id,
      budgetPlanCapexId: r.budgetPlanCapexId,
      budgetPlanDisplayId: r.budgetPlan.displayId,
      itemCode: r.budgetPlan.itemCode,
      itemDescription: r.budgetPlan.itemDescription,
      vendor: r.vendor,
      requester: r.requester,
      noCapex: r.noCapex,
      projectCode: r.projectCode,
      noUi: r.noUi,
      prNumber: r.prNumber,
      poType: r.poType,
      poNumber: r.poNumber,
      documentGr: r.documentGr,
      description: r.description,
      assetNumber: r.assetNumber,
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
    console.error("GET TRANSACTION CAPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data Transaksi CAPEX." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transaction/capex
 * Create transaksi CAPEX + update budget plan
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      budgetPlanCapexId,
      vendor,
      requester,
      noCapex,
      projectCode,
      noUi,
      prNumber,
      poType,
      poNumber,
      documentGr,
      description,
      assetNumber,
      qty,
      amount,
      submissionDate,
      approvedDate,
      deliveryDate,
      oc,
      ccLob,
      status,
      notes,
    } = body as any;

    if (
      !budgetPlanCapexId ||
      !vendor ||
      !requester ||
      !description ||
      !assetNumber ||
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

    const plan = await prisma.budgetPlanCapex.findUnique({
      where: { id: budgetPlanCapexId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Budget Plan CAPEX tidak ditemukan." },
        { status: 404 }
      );
    }

    if (plan.budgetRemainingAmount < trxAmount) {
      return NextResponse.json(
        { error: "Budget remaining tidak mencukupi." },
        { status: 400 }
      );
    }

    const created = await prisma.$transaction(async (tx) => {
      const trx = await tx.transactionCapex.create({
        data: {
          budgetPlanCapexId,
          vendor,
          requester,
          noCapex,
          projectCode,
          noUi,
          prNumber,
          poType,
          poNumber,
          documentGr,
          description,
          assetNumber,
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

      await tx.budgetPlanCapex.update({
        where: { id: budgetPlanCapexId },
        data: {
          budgetRealisasiAmount: plan.budgetRealisasiAmount + trxAmount,
          budgetRemainingAmount: plan.budgetRemainingAmount - trxAmount,
        },
      });

      return trx;
    });

    return NextResponse.json(
      {
        message: "Transaksi CAPEX berhasil dicatat.",
        data: {
          transactionId: created.id,
          budgetPlanCapexId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST TRANSACTION CAPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mencatat transaksi CAPEX." },
      { status: 500 }
    );
  }
}
