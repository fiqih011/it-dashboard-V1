// app/api/transaction/opex/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ======================================================
 * UTIL — Generate Transaction Display ID
 * Format: TRX-OP-YY-XXXX
 * Sequence reset per tahun (OPEX)
 * ======================================================
 */
async function generateTransactionDisplayId(
  tx: Prisma.TransactionClient,
  year: number
): Promise<string> {
  const yy = String(year).slice(-2);

  const lastTrx = await tx.transactionOpex.findFirst({
    where: {
      displayId: {
        startsWith: `TRX-OP-${yy}-`,
      },
    },
    orderBy: {
      displayId: "desc",
    },
    select: {
      displayId: true,
    },
  });

  let nextSeq = 1;

  if (lastTrx?.displayId) {
    const parts = lastTrx.displayId.split("-");
    const lastSeq = Number(parts[3]);
    if (!Number.isNaN(lastSeq)) {
      nextSeq = lastSeq + 1;
    }
  }

  const seq = String(nextSeq).padStart(4, "0");
  return `TRX-OP-${yy}-${seq}`;
}

/**
 * ======================================================
 * GET /api/transaction/opex
 * ======================================================
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
            category: true,
            component: true,
          },
        },
      },
    });

    const data = rows.map((r) => ({
      id: r.id, // UUID internal
      displayId: r.displayId, // Transaction ID (human readable)
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
 * ======================================================
 * POST /api/transaction/opex
 * CREATE transaksi OPEX (atomic)
 * ======================================================
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
    } = body as {
      budgetPlanOpexId: string;
      vendor: string;
      requester: string;
      prNumber?: string;
      poType?: string;
      poNumber?: string;
      documentGr?: string;
      description: string;
      qty: number;
      amount: number | string;
      submissionDate?: string;
      approvedDate?: string;
      deliveryDate?: string;
      oc?: string;
      ccLob?: string;
      coa?: string;
      status?: string;
      notes?: string;
    };

    if (
      !budgetPlanOpexId ||
      !vendor ||
      !requester ||
      !description ||
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

    const result = await prisma.$transaction(async (tx) => {
      const plan = await tx.budgetPlanOpex.findUnique({
        where: { id: budgetPlanOpexId },
      });

      if (!plan) throw new Error("BUDGET_PLAN_NOT_FOUND");
      if (coa && coa !== plan.coa) throw new Error("COA_MISMATCH");
      if (plan.budgetRemainingAmount < trxAmount)
        throw new Error("INSUFFICIENT_BUDGET");

      const trxDate = submissionDate
        ? new Date(submissionDate)
        : new Date();

      const displayId = await generateTransactionDisplayId(
        tx,
        trxDate.getFullYear()
      );

      const trx = await tx.transactionOpex.create({
        data: {
          displayId,
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
          budgetRealisasiAmount:
            plan.budgetRealisasiAmount + trxAmount,
          budgetRemainingAmount:
            plan.budgetRemainingAmount - trxAmount,
        },
      });

      return trx;
    });

    return NextResponse.json(
      {
        message: "Transaksi OPEX berhasil dicatat.",
        data: {
          id: result.id,
          displayId: result.displayId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "BUDGET_PLAN_NOT_FOUND") {
        return NextResponse.json(
          { error: "Budget Plan OPEX tidak ditemukan." },
          { status: 404 }
        );
      }
      if (error.message === "COA_MISMATCH") {
        return NextResponse.json(
          { error: "COA transaksi tidak sesuai dengan Budget Plan." },
          { status: 400 }
        );
      }
      if (error.message === "INSUFFICIENT_BUDGET") {
        return NextResponse.json(
          { error: "Budget remaining tidak mencukupi." },
          { status: 400 }
        );
      }
    }

    console.error("POST TRANSACTION OPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mencatat transaksi OPEX." },
      { status: 500 }
    );
  }
}
