import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =========================================================
 * GET — TRANSACTION CAPEX BY ID
 * =========================================================
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const trx = await prisma.transactionCapex.findUnique({
      where: { id },
      include: {
        budgetPlan: {
          select: {
            id: true,
            budgetDisplayId: true,
            itemCode: true,
            noCapex: true,  // ✅ CAMELCASE!
            budgetRemainingAmount: true,
          },
        },
      },
    });

    if (!trx) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: trx.id,
      transactionDisplayId: trx.transactionDisplayId,

      budgetPlanCapexId: trx.budgetPlanCapexId,
      budgetPlanDisplayId: trx.budgetPlan.budgetDisplayId,
      budgetRemainingAmount: trx.budgetPlan.budgetRemainingAmount.toString(),

      vendor: trx.vendor,
      requester: trx.requester,
      
      projectCode: trx.projectCode,
      noUi: trx.noUi,
      
      prNumber: trx.prNumber,
      poType: trx.poType,
      poNumber: trx.poNumber,
      documentGr: trx.documentGr,
      
      description: trx.description,
      assetNumber: trx.assetNumber,
      
      qty: Number(trx.qty),
      amount: trx.amount.toString(),

      submissionDate: trx.submissionDate,
      approvedDate: trx.approvedDate,
      deliveryStatus: trx.deliveryStatus,

      oc: trx.oc,
      ccLob: trx.ccLob,
      status: trx.status,
      notes: trx.notes,

      budgetPlan: {
        id: trx.budgetPlan.id,
        budgetDisplayId: trx.budgetPlan.budgetDisplayId,
        itemCode: trx.budgetPlan.itemCode,
        noCapex: trx.budgetPlan.noCapex,  // ✅ CAMELCASE!
        budgetRemainingAmount: trx.budgetPlan.budgetRemainingAmount.toString(),
      },
    });
  } catch (err) {
    console.error("[GET TRANSACTION CAPEX ERROR]", err);
    return NextResponse.json(
      { error: "Gagal mengambil data transaksi" },
      { status: 500 }
    );
  }
}

/**
 * =========================================================
 * PUT — UPDATE TRANSACTION CAPEX WITH BUDGET RECALCULATION
 * =========================================================
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // 1️⃣ Ambil transaksi lama
    const oldTrx = await prisma.transactionCapex.findUnique({
      where: { id },
      select: {
        id: true,
        amount: true,
        budgetPlanCapexId: true,
      },
    });

    if (!oldTrx) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    const oldAmount = oldTrx.amount;
    const newAmount = BigInt(body.amount);
    const selisih = newAmount - oldAmount;

    // 2️⃣ Update transaksi
    await prisma.transactionCapex.update({
      where: { id: oldTrx.id },
      data: {
        vendor: body.vendor,
        requester: body.requester,
        
        // ✅ TAMBAH FIELD YANG KURANG
        projectCode: body.projectCode || null,
        noUi: body.noUi || null,
        
        prNumber: body.prNumber || null,
        poType: body.poType || null,
        poNumber: body.poNumber || null,
        documentGr: body.documentGR || null, // ⚠️ body.documentGR → db.documentGr
        
        description: body.description || null,
        assetNumber: body.assetNumber || null,
        
        qty: Number(body.qty),
        amount: newAmount,

        submissionDate: body.submissionDate
          ? new Date(body.submissionDate)
          : null,
        approvedDate: body.approvedDate
          ? new Date(body.approvedDate)
          : null,
        
        deliveryStatus: body.deliveryStatus || null, // ✅ GANTI deliveryDate jadi deliveryStatus

        oc: body.oc || null,
        ccLob: body.ccLob || null,
        status: body.status || null,
        notes: body.notes || null,
      },
    });

    // 3️⃣ Update budget plan CAPEX
    if (selisih !== BigInt(0)) {
      await prisma.budgetPlanCapex.update({
        where: { id: oldTrx.budgetPlanCapexId },
        data: {
          budgetRealisasiAmount: {
            increment: selisih,
          },
          budgetRemainingAmount: {
            decrement: selisih,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Transaksi CAPEX berhasil diupdate dan budget plan telah disesuaikan",
    });
  } catch (err) {
    console.error("[PUT TRANSACTION CAPEX ERROR]", err);
    return NextResponse.json(
      { error: "Gagal update transaksi CAPEX" },
      { status: 500 }
    );
  }
}

/**
 * =========================================================
 * DELETE — DELETE TRANSACTION CAPEX WITH BUDGET RESTORATION
 * =========================================================
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1️⃣ Ambil transaksi
    const trx = await prisma.transactionCapex.findUnique({
      where: { id },
      select: {
        id: true,
        amount: true,
        budgetPlanCapexId: true,
      },
    });

    if (!trx) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2️⃣ Restore budget plan
    await prisma.budgetPlanCapex.update({
      where: { id: trx.budgetPlanCapexId },
      data: {
        budgetRealisasiAmount: {
          decrement: trx.amount,
        },
        budgetRemainingAmount: {
          increment: trx.amount,
        },
      },
    });

    // 3️⃣ Hapus transaksi
    await prisma.transactionCapex.delete({
      where: { id: trx.id },
    });

    return NextResponse.json({
      success: true,
      message: "Transaksi CAPEX berhasil dihapus dan budget plan dikembalikan",
    });
  } catch (err) {
    console.error("[DELETE TRANSACTION CAPEX ERROR]", err);
    return NextResponse.json(
      { error: "Gagal menghapus transaksi CAPEX" },
      { status: 500 }
    );
  }
}