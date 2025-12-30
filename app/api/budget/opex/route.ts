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
 * HELPER — GENERATE DISPLAY ID
 * FORMAT: OP-25xxxx
 * =====================================================
 */
async function generateOpexDisplayId(year: number): Promise<string> {
  const yearShort = String(year).slice(-2);

  const last = await prisma.budgetPlanOpex.findFirst({
    where: {
      year,
      displayId: { startsWith: `OP-${yearShort}` },
    },
    orderBy: { displayId: "desc" },
    select: { displayId: true },
  });

  const next =
    last?.displayId
      ? Number(last.displayId.slice(-4)) + 1
      : 1;

  return `OP-${yearShort}${String(next).padStart(4, "0")}`;
}

/**
 * =====================================================
 * GET — LIST BUDGET PLAN OPEX (UNTUK TABLE)
 * =====================================================
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);

    const year = searchParams.get("year");
    const id = searchParams.get("id");
    const coa = searchParams.get("coa");
    const component = searchParams.get("component");

    const where: any = {};
    if (year) where.year = Number(year);
    if (id) where.displayId = { contains: id };
    if (coa) where.coa = { contains: coa };
    if (component)
      where.component = { contains: component, mode: "insensitive" };

    const [data, total] = await Promise.all([
      prisma.budgetPlanOpex.findMany({
        where,
        orderBy: { displayId: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.budgetPlanOpex.count({ where }),
    ]);

    return NextResponse.json(
      serializeBigInt({ data, total })
    );
  } catch (error) {
    console.error("GET OPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data Budget Plan OPEX" },
      { status: 500 }
    );
  }
}

/**
 * =====================================================
 * POST — CREATE / UPDATE (SUDAH FIX & DIKUNCI)
 * =====================================================
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      year,
      coa,
      category,
      component,
      budgetPlanAmount,
    } = body;

    if (
      !year ||
      !coa ||
      !category ||
      !component ||
      budgetPlanAmount === undefined
    ) {
      return NextResponse.json(
        { error: "Field wajib belum lengkap" },
        { status: 400 }
      );
    }

    const planAmount = BigInt(budgetPlanAmount);

    // ================= UPDATE =================
    if (id) {
      const existing = await prisma.budgetPlanOpex.findUnique({
        where: { id },
      });

      if (!existing) {
        return NextResponse.json(
          { error: "Data tidak ditemukan" },
          { status: 404 }
        );
      }

      const updated = await prisma.budgetPlanOpex.update({
        where: { id },
        data: {
          coa,
          category,
          component,
          budgetPlanAmount: planAmount,
          budgetRemainingAmount:
            planAmount - existing.budgetRealisasiAmount,
        },
      });

      return NextResponse.json(serializeBigInt(updated));
    }

    // ================= CREATE =================
    const displayId = await generateOpexDisplayId(year);

    const created = await prisma.budgetPlanOpex.create({
      data: {
        displayId,
        year,
        coa,
        category,
        component,
        budgetPlanAmount: planAmount,
        budgetRealisasiAmount: BigInt(0),
        budgetRemainingAmount: planAmount,
      },
    });

    return NextResponse.json(serializeBigInt(created));
  } catch (error) {
    console.error("POST OPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan Budget Plan OPEX" },
      { status: 500 }
    );
  }
}
