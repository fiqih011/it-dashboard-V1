import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * ===============================
 * BIGINT SERIALIZER
 * ===============================
 */
function serialize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    )
  );
}

/**
 * ===============================
 * GET — LIST
 * ===============================
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  const where: any = {};

  if (searchParams.get("year"))
    where.year = Number(searchParams.get("year"));

  if (searchParams.get("displayId"))
    where.displayId = {
      contains: searchParams.get("displayId"),
      mode: "insensitive",
    };
  if (searchParams.get("coa"))
    where.coa = {
      contains: searchParams.get("coa"),
  }
  if (searchParams.get("category"))
    where.category = {
      contains: searchParams.get("category"),
      mode: "insensitive",
    };

  if (searchParams.get("component"))
    where.component = {
      contains: searchParams.get("component"),
      mode: "insensitive",
    };

  const [data, total] = await Promise.all([
    prisma.budgetPlanOpex.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.budgetPlanOpex.count({ where }),
  ]);

  return NextResponse.json(serialize({ data, total }));
}

/**
 * ===============================
 * POST — CREATE & UPDATE
 * ===============================
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

    /**
     * ===============================
     * UPDATE
     * ===============================
     */
    if (id) {
      const existing =
        await prisma.budgetPlanOpex.findUnique({
          where: { id },
        });

      if (!existing) {
        return NextResponse.json(
          { error: "Data tidak ditemukan" },
          { status: 404 }
        );
      }

      const updated =
        await prisma.budgetPlanOpex.update({
          where: { id },
          data: {
            coa,
            category,
            component,
            budgetPlanAmount: planAmount,
            budgetRemainingAmount:
              planAmount -
              existing.budgetRealisasiAmount,
          },
        });

      return NextResponse.json(serialize(updated));
    }

    /**
     * ===============================
     * CREATE
     * ===============================
     */
    const yearShort = String(year).slice(-2);

    const last =
      await prisma.budgetPlanOpex.findFirst({
        where: {
          year,
          displayId: { startsWith: `OP-${yearShort}` },
        },
        orderBy: { displayId: "desc" },
        select: { displayId: true },
      });

    const next = last?.displayId
      ? Number(last.displayId.slice(-4)) + 1
      : 1;

    const displayId = `OP-${yearShort}${String(next).padStart(4, "0")}`;

    const created =
      await prisma.budgetPlanOpex.create({
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

    return NextResponse.json(serialize(created));
  } catch (error) {
    console.error("POST BUDGET OPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan Budget Plan OPEX" },
      { status: 500 }
    );
  }
}
