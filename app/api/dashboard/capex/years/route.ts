import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const years = await prisma.budgetPlanCapex.findMany({
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
    console.error("[DASHBOARD CAPEX YEARS ERROR]", error);

    return NextResponse.json(
      { error: "Gagal mengambil daftar tahun CAPEX" },
      { status: 500 }
    );
  }
}
