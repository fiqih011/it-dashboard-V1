import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =====================================================
 * HELPER — SERIALIZE BIGINT
 * =====================================================
 */
function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

/**
 * =====================================================
 * GET — SINGLE BUDGET PLAN CAPEX BY ID
 * =====================================================
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ SAMA PERSIS DENGAN OPEX
) {
  try {
    const { id } = await params; // ✅ AWAIT params

    console.log("Fetching CAPEX budget with ID:", id);

    const budgetPlan = await prisma.budgetPlanCapex.findUnique({
      where: { id },
    });

    if (!budgetPlan) {
      console.error("CAPEX Budget not found for ID:", id);
      return NextResponse.json(
        { error: "Budget CAPEX tidak ditemukan" },
        { status: 404 }
      );
    }

    console.log("CAPEX Budget found:", budgetPlan.budgetDisplayId);

    return NextResponse.json(serializeBigInt(budgetPlan));
  } catch (error) {
    console.error("GET CAPEX BY ID ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data Budget Plan CAPEX" },
      { status: 500 }
    );
  }
}

/**
 * =====================================================
 * DELETE — BUDGET PLAN CAPEX BY ID
 * =====================================================
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ SAMA POLA
) {
  try {
    const { id } = await params;

    console.log("Deleting CAPEX budget with ID:", id);

    const existing = await prisma.budgetPlanCapex.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Budget CAPEX tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.budgetPlanCapex.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE CAPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal menghapus Budget Plan CAPEX" },
      { status: 500 }
    );
  }
}
