// lib/id-generator.ts
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type BudgetType = "OPEX" | "CAPEX";

interface IdConfig {
  prefix: string;
  tableName: string;
}

const CONFIG: Record<BudgetType, IdConfig> = {
  OPEX: {
    prefix: "OP",
    tableName: "budget_plan_opex",
  },
  CAPEX: {
    prefix: "CA",
    tableName: "budget_plan_capex",
  },
};

/**
 * Generate display ID:
 * OPEX  -> OP-YYXXXX
 * CAPEX -> CA-YYXXXX
 */
export async function generateBudgetDisplayId(
  type: BudgetType
): Promise<string> {
  const config = CONFIG[type];

  // Ambil tahun server (YYYY -> YY)
  const now = new Date();
  const fullYear = now.getFullYear(); // 2025
  const yearYY = String(fullYear).slice(-2); // "25"

  // Query ID terakhir per type + tahun
  const result = await prisma.$queryRaw<
    { display_id: string }[]
  >(
    Prisma.sql`
      SELECT display_id
      FROM ${Prisma.raw(config.tableName)}
      WHERE display_id LIKE ${`${config.prefix}-${yearYY}%`}
      ORDER BY display_id DESC
      LIMIT 1
    `
  );

  let nextRunningNumber = 1;

  if (result.length > 0) {
    const lastId = result[0].display_id; // contoh: OP-250012
    const lastRunning = Number(lastId.slice(-4)); // "0012" -> 12

    if (!Number.isNaN(lastRunning)) {
      nextRunningNumber = lastRunning + 1;
    }
  }

  const runningPadded = String(nextRunningNumber).padStart(4, "0");

  return `${config.prefix}-${yearYY}${runningPadded}`;
}
