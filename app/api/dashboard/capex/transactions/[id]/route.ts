import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ WAJIB await params (Next.js 16+)
    const { id: budgetPlanId } = await context.params;

    if (!budgetPlanId) {
      return NextResponse.json(
        { error: "BudgetPlan ID is required" },
        { status: 400 }
      );
    }

    // =====================================================
    // 1. Get Budget Plan
    // =====================================================
    const budgetPlan = await prisma.budgetPlanCapex.findUnique({
      where: { id: budgetPlanId },
      select: {
        budgetDisplayId: true,
        itemCode: true,
        itemDescription: true,
        noCapex: true,
        budgetPlanAmount: true,
        budgetRealisasiAmount: true,
        budgetRemainingAmount: true,
      },
    });

    if (!budgetPlan) {
      return NextResponse.json(
        { error: "Budget plan not found" },
        { status: 404 }
      );
    }

    // =====================================================
    // 2. Get Transactions
    // =====================================================
    const transactions = await prisma.transactionCapex.findMany({
      where: { budgetPlanCapexId: budgetPlanId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        transactionDisplayId: true,
        vendor: true,
        requester: true,
        description: true,
        amount: true,
        qty: true,
        status: true,
        submissionDate: true,
        approvedDate: true,
        deliveryStatus: true,
        prNumber: true,
        poNumber: true,
        projectCode: true,
        noUi: true,
        assetNumber: true,
        createdAt: true,
      },
    });

    // =====================================================
    // 3. Response
    // =====================================================
    return NextResponse.json({
      budgetInfo: {
        budgetId: budgetPlan.budgetDisplayId,
        itemCode: budgetPlan.itemCode,
        itemDescription: budgetPlan.itemDescription,
        noCapex: budgetPlan.noCapex,
        totalBudget: Number(budgetPlan.budgetPlanAmount),
        used: Number(budgetPlan.budgetRealisasiAmount),
        remaining: Number(budgetPlan.budgetRemainingAmount),
      },
      transactions: transactions.map((t) => ({
        id: t.id,
        transactionId: t.transactionDisplayId,
        vendor: t.vendor,
        requester: t.requester,
        description: t.description,
        amount: Number(t.amount),
        qty: t.qty,
        status: t.status,
        submissionDate: t.submissionDate?.toISOString() ?? null,
        approvedDate: t.approvedDate?.toISOString() ?? null,
        deliveryStatus: t.deliveryStatus,
        prNumber: t.prNumber,
        poNumber: t.poNumber,
        projectCode: t.projectCode,
        noUi: t.noUi,
        assetNumber: t.assetNumber,
        createdAt: t.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[CAPEX TRANSACTION API ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}