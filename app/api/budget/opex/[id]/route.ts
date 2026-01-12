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
 * GET — SINGLE BUDGET PLAN BY ID
 * =====================================================
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ UBAH: Promise<{ id: string }>
) {
  try {
    const { id } = await params; // ✅ AWAIT params dulu
    
    console.log("Fetching budget with ID:", id); // Debug log

    const budgetPlan = await prisma.budgetPlanOpex.findUnique({
      where: { id }, // ✅ Sekarang id udah resolved
    });

    if (!budgetPlan) {
      console.error("Budget not found for ID:", id);
      return NextResponse.json(
        { error: "Budget tidak ditemukan" },
        { status: 404 }
      );
    }

    console.log("Budget found:", budgetPlan.displayId);
    return NextResponse.json(serializeBigInt(budgetPlan));
  } catch (error) {
    console.error("GET OPEX BY ID ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data Budget Plan" },
      { status: 500 }
    );
  }
}