import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =========================================================
 * GET — FILTER OPTIONS FOR TRANSACTION CAPEX
 * =========================================================
 * READ ONLY
 * - Ambil opsi filter berdasarkan transactionDisplayId
 * - Year diambil dari pattern TRX-CP-YY-XXXX
 * - ✅ NO RELATION QUERY - use direct fields only
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
     * ✅ NO RELATION - just select fields directly
     * =====================================================
     */
    const transactions = await prisma.transactionCapex.findMany({
      where: {
        transactionDisplayId: {
          startsWith: `TRX-CA-${yearShort}-`,
        },
      },
      select: {
        transactionDisplayId: true,
        budgetPlanCapexId: true,  // ✅ Direct field (is the display ID!)
        vendor: true,
        requester: true,
        description: true,
        projectCode: true,
        noUi: true,
      },
    });

    /**
     * =====================================================
     * 2️⃣ Helper unique
     * =====================================================
     */
    function unique(values: (string | null | undefined)[]) {
      return Array.from(
        new Set(values.filter((v): v is string => !!v && v.trim() !== ""))
      ).sort();
    }

    /**
     * =====================================================
     * 3️⃣ Ambil semua tahun unik dari transactionDisplayId
     * =====================================================
     */
    const allDisplayIds = await prisma.transactionCapex.findMany({
      select: {
        transactionDisplayId: true,
      },
    });

    const years = unique(
      allDisplayIds.map((t) => {
        const match = t.transactionDisplayId.match(/TRX-CA-(\d{2})-/);
        if (!match) return null;

        const fullYear = `20${match[1]}`;
        return fullYear;
      })
    ).sort((a, b) => Number(b) - Number(a));

    /**
     * =====================================================
     * 4️⃣ Return structured options
     * ✅ budgetPlanCapexId is already the display ID!
     * =====================================================
     */
    return NextResponse.json({
      years,
      transactionIds: unique(transactions.map((t) => t.transactionDisplayId)),
      budgetPlanIds: unique(transactions.map((t) => t.budgetPlanCapexId)),
      vendors: unique(transactions.map((t) => t.vendor)),
      requesters: unique(transactions.map((t) => t.requester)),
      descriptions: unique(transactions.map((t) => t.description)),
      projectCodes: unique(transactions.map((t) => t.projectCode)),
      noUis: unique(transactions.map((t) => t.noUi)),
    });
  } catch (err) {
    console.error("[CAPEX FILTER OPTIONS ERROR]", err);

    return NextResponse.json(
      { error: "Gagal mengambil filter options" },
      { status: 500 }
    );
  }
}