import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =========================================================
 * GET — FILTER OPTIONS FOR TRANSACTION OPEX
 * =========================================================
 * READ ONLY
 * - Ambil opsi filter berdasarkan displayId
 * - Year diambil dari pattern TRX-OP-YY-XXXX
 * - Tidak mengganggu API utama
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const yearParam = searchParams.get("year") ?? undefined;

    const currentYearShort = new Date()
      .getFullYear()
      .toString()
      .slice(-2);

    const yearShort = yearParam
      ? yearParam.slice(-2)
      : currentYearShort;

    /**
     * =====================================================
     * 1️⃣ Ambil semua transaksi tahun tertentu
     * =====================================================
     */
    const transactions = await prisma.transactionOpex.findMany({
      where: {
        displayId: {
          startsWith: `TRX-OP-${yearShort}-`,
        },
      },
      select: {
        displayId: true,
        vendor: true,
        coa: true,
        description: true,
        budgetPlan: {
          select: {
            displayId: true,
          },
        },
      },
    });

    /**
     * =====================================================
     * 2️⃣ Helper unique
     * =====================================================
     */
    function unique(values: (string | null)[]) {
      return Array.from(
        new Set(values.filter((v): v is string => !!v && v.trim() !== ""))
      ).sort();
    }

    /**
     * =====================================================
     * 3️⃣ Ambil semua tahun unik dari displayId
     * =====================================================
     */
    const allDisplayIds = await prisma.transactionOpex.findMany({
      select: {
        displayId: true,
      },
    });

    const years = unique(
      allDisplayIds.map((t) => {
        const match = t.displayId.match(/TRX-OP-(\d{2})-/);
        if (!match) return null;

        const fullYear = `20${match[1]}`;
        return fullYear;
      })
    ).sort((a, b) => Number(b) - Number(a));

    /**
     * =====================================================
     * 4️⃣ Return structured options
     * =====================================================
     */
    return NextResponse.json({
      years,
      transactionIds: unique(transactions.map((t) => t.displayId)),
      budgetPlanIds: unique(
        transactions.map((t) => t.budgetPlan.displayId)
      ),
      vendors: unique(transactions.map((t) => t.vendor)),
      coas: unique(transactions.map((t) => t.coa)),
      descriptions: unique(transactions.map((t) => t.description)),
    });
  } catch (err) {
    console.error("[FILTER OPTIONS ERROR]", err);

    return NextResponse.json(
      { error: "Gagal mengambil filter options" },
      { status: 500 }
    );
  }
}
