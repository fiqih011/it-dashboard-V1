import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =========================================================
 * GET — DASHBOARD OPEX : AVAILABLE YEARS
 * =========================================================
 * READ ONLY
 * - Mengambil daftar tahun unik dari BudgetPlanOpex
 * - Digunakan untuk filter tahun di Dashboard
 */
export async function GET() {
  try {
    const years = await prisma.budgetPlanOpex.findMany({
      select: {
        year: true,
      },
      distinct: ["year"],
      orderBy: {
        year: "desc",
      },
    });

    return NextResponse.json(years.map((y) => y.year));
  } catch (error) {
    console.error("[DASHBOARD OPEX YEARS ERROR]", error);

    return NextResponse.json(
      { error: "Gagal mengambil daftar tahun OPEX" },
      { status: 500 }
    );
  }
}
