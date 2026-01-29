import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * ===============================
 * BIGINT SERIALIZER (WAJIB)
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
 * GET — LIST CAPEX
 * ===============================
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);

    const where: any = {};

    if (searchParams.get("year"))
      where.year = Number(searchParams.get("year"));

    if (searchParams.get("budgetDisplayId"))
      where.budgetDisplayId = {
        contains: searchParams.get("budgetDisplayId"),
        mode: "insensitive",
      };

    if (searchParams.get("itemCode"))
      where.itemCode = {
        contains: searchParams.get("itemCode"),
        mode: "insensitive",
      };

    if (searchParams.get("itemDescription"))
      where.itemDescription = {
        contains: searchParams.get("itemDescription"),
        mode: "insensitive",
      };

    if (searchParams.get("noCapex"))
      where.noCapex = {
        contains: searchParams.get("noCapex"),
        mode: "insensitive",
      };
    if (searchParams.get("itemRemark"))
      where.itemRemark = {
        contains: searchParams.get("itemRemark"),
        mode: "insensitive",
      };
    const [data, total] = await Promise.all([
      prisma.budgetPlanCapex.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.budgetPlanCapex.count({ where }),
    ]);

    return NextResponse.json(serialize({ data, total }));
  } catch (error) {
    console.error("GET CAPEX ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch CAPEX budget plans" },
      { status: 500 }
    );
  }
}

/**
 * ===============================
 * POST — CREATE & UPDATE CAPEX
 * ===============================
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      year,
      itemCode,
      itemDescription,
      noCapex,
      itemRemark,
      budgetPlanAmount,
    } = body;

    // ===============================
    // VALIDATION
    // ===============================
    if (
      !year ||
      !itemCode ||
      !itemDescription ||
      !noCapex ||
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
      const existing = await prisma.budgetPlanCapex.findUnique({
        where: { id },
      });

      if (!existing) {
        return NextResponse.json(
          { error: "Data tidak ditemukan" },
          { status: 404 }
        );
      }

      const updated = await prisma.budgetPlanCapex.update({
        where: { id },
        data: {
          itemCode,
          itemDescription,
          noCapex,
          itemRemark,
          budgetPlanAmount: planAmount,
          budgetRemainingAmount:
            planAmount - existing.budgetRealisasiAmount,
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

    const last = await prisma.budgetPlanCapex.findFirst({
      where: {
        year,
        budgetDisplayId: { startsWith: `CA-${yearShort}` },
      },
      orderBy: { budgetDisplayId: "desc" },
      select: { budgetDisplayId: true },
    });

    const next = last?.budgetDisplayId
      ? Number(last.budgetDisplayId.slice(-4)) + 1
      : 1;

    const budgetDisplayId = `CA-${yearShort}${String(next).padStart(4, "0")}`;

    const created = await prisma.budgetPlanCapex.create({
      data: {
        budgetDisplayId,
        year,
        itemCode,
        itemDescription,
        noCapex,
        itemRemark,
        budgetPlanAmount: planAmount,
        budgetRealisasiAmount: BigInt(0),
        budgetRemainingAmount: planAmount,
      },
    });

    return NextResponse.json(
      serialize({
        success: true,
        id: created.id,
        budgetDisplayId,
      })
    );
  } catch (error) {
    console.error("POST CAPEX ERROR:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan Budget Plan CAPEX" },
      { status: 500 }
    );
  }
}
