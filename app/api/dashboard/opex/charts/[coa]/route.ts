import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust import sesuai prisma setup lu
import {
  calculateDistributionData,
  calculateStatusData,
} from "@/lib/budget-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ coa: string }> }
) {
  try {
    const { coa } = await params; // ✅ AWAIT params!

    // Get year from query params or use current year
    const searchParams = new URL(request.url).searchParams;
    const year = parseInt(
      searchParams.get("year") || new Date().getFullYear().toString()
    );

    // Fetch ALL budget plans for this COA (using contains like existing APIs)
    console.log(`🔍 [CHARTS API] Querying COA: "${coa}", Year: ${year}`);
    
    const budgetPlans = await prisma.budgetPlanOpex.findMany({
      where: {
        year: year,
        coa: {
          contains: coa,
          mode: "insensitive",
        },
      },
      select: {
        displayId: true,
        component: true,
        budgetPlanAmount: true,
        budgetRealisasiAmount: true,
        coa: true, // ← Add this to see actual COA values
      },
      orderBy: {
        budgetRealisasiAmount: "asc", // Sort ascending (smallest first) for chart display
      },
    });

    console.log(`📊 [CHARTS API] Found ${budgetPlans.length} budgets`);
    if (budgetPlans.length > 0) {
      console.log(`📋 [CHARTS API] First 3 COA values:`, budgetPlans.slice(0, 3).map(b => b.coa));
    }

    // If no data, return empty arrays
    if (budgetPlans.length === 0) {
      return NextResponse.json({
        distributionData: [],
        statusData: {
          onTrack: 0,
          warning: 0,
          overBudget: 0,
          total: 0,
        },
      });
    }

    // Calculate status from ALL budgets in this COA
    const statusData = calculateStatusData(budgetPlans);

    // Calculate distribution from ALL budgets in this COA
    const distributionData = calculateDistributionData(budgetPlans);

    return NextResponse.json({
      distributionData,
      statusData,
    });
  } catch (error) {
    console.error("Error fetching budget charts data:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget charts data" },
      { status: 500 }
    );
  }
}