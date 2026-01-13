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
    const budgetPlan = await prisma.budgetPlanOpex.findUnique({
      where: { id: budgetPlanId },
      select: {
        displayId: true,
        component: true,
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
    const transactions = await prisma.transactionOpex.findMany({
      where: { budgetPlanOpexId: budgetPlanId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        displayId: true,
        vendor: true,
        requester: true,
        description: true,
        amount: true,
        qty: true,
        status: true,
        submissionDate: true,
        approvedDate: true,
        deliveryDate: true,
        prNumber: true,
        poNumber: true,
        createdAt: true,
      },
    });

    // =====================================================
    // 3. Response
    // =====================================================
    return NextResponse.json({
      budgetInfo: {
        budgetId: budgetPlan.displayId,
        component: budgetPlan.component,
        totalBudget: Number(budgetPlan.budgetPlanAmount),
        used: Number(budgetPlan.budgetRealisasiAmount),
        remaining: Number(budgetPlan.budgetRemainingAmount),
      },
      transactions: transactions.map((t) => ({
        id: t.id,
        transactionId: t.displayId,
        vendor: t.vendor,
        requester: t.requester,
        description: t.description,
        amount: Number(t.amount),
        qty: t.qty,
        status: t.status,
        submissionDate: t.submissionDate?.toISOString() ?? null,
        approvedDate: t.approvedDate?.toISOString() ?? null,
        deliveryDate: t.deliveryDate?.toISOString() ?? null,
        prNumber: t.prNumber,
        poNumber: t.poNumber,
        createdAt: t.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[OPEX TRANSACTION API ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
