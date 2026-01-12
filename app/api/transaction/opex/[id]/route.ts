import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =========================================================
 * GET — TRANSACTION OPEX BY ID
 * =========================================================
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const trx = await prisma.transactionOpex.findUnique({
      where: {
        id: id,
      },
      include: {
        budgetPlan: {
          select: {
            displayId: true,
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
      displayId: trx.displayId,
      budgetPlanDisplayId: trx.budgetPlan.displayId,

      vendor: trx.vendor,
      requester: trx.requester,
      prNumber: trx.prNumber,
      poType: trx.poType,
      poNumber: trx.poNumber,
      documentGr: trx.documentGr,

      description: trx.description,
      qty: Number(trx.qty),
      amount: trx.amount.toString(),

      submissionDate: trx.submissionDate,
      approvedDate: trx.approvedDate,
      deliveryDate: trx.deliveryDate,

      oc: trx.oc,
      ccLob: trx.ccLob,
      coa: trx.coa,
      status: trx.status,
      notes: trx.notes,
    });
  } catch (err) {
    console.error("[GET TRANSACTION OPEX ERROR]", err);
    return NextResponse.json(
      { error: "Gagal mengambil data transaksi" },
      { status: 500 }
    );
  }
}

/**
 * =========================================================
 * PUT — UPDATE TRANSACTION OPEX WITH BUDGET RECALCULATION
 * =========================================================
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // 1️⃣ Ambil data transaksi LAMA
    const oldTrx = await prisma.transactionOpex.findUnique({
      where: { id: id },
      select: { 
        id: true, 
        amount: true,
        budgetPlanOpexId: true 
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
    await prisma.transactionOpex.update({
      where: { id: oldTrx.id },
      data: {
        vendor: body.vendor,
        requester: body.requester,
        prNumber: body.prNumber || null,
        poType: body.poType || null,
        poNumber: body.poNumber || null,
        documentGr: body.documentGR || null,
        description: body.description || null,
        qty: Number(body.qty),
        amount: newAmount,

        submissionDate: body.submissionDate
          ? new Date(body.submissionDate)
          : null,
        approvedDate: body.approvedDate
          ? new Date(body.approvedDate)
          : null,
        deliveryDate: body.deliveryDate
          ? new Date(body.deliveryDate)
          : null,

        oc: body.oc || null,
        ccLob: body.cc || null,
        status: body.status || null,
        notes: body.notes || null,
      },
    });

    // 3️⃣ Update budget plan (tambah/kurangi sesuai selisih)
    if (selisih !== BigInt(0)) {
      await prisma.budgetPlanOpex.update({
        where: { id: oldTrx.budgetPlanOpexId },
        data: {
          budgetRealisasiAmount: {
            increment: selisih, // Jika positif = nambah, negatif = kurang
          },
          budgetRemainingAmount: {
            decrement: selisih, // Kebalikannya
          },
        },
      });
    }

    return NextResponse.json({ 
      success: true,
      message: "Transaksi berhasil diupdate dan budget plan telah disesuaikan"
    });
  } catch (err) {
    console.error("[PUT TRANSACTION OPEX ERROR]", err);
    return NextResponse.json(
      { error: "Gagal update transaksi" },
      { status: 500 }
    );
  }
}

/**
 * =========================================================
 * DELETE — DELETE TRANSACTION WITH BUDGET RESTORATION
 * =========================================================
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 1️⃣ Ambil data transaksi yang akan dihapus
    const trx = await prisma.transactionOpex.findUnique({
      where: { id: id },
      select: { 
        id: true, 
        amount: true,
        budgetPlanOpexId: true 
      },
    });

    if (!trx) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2️⃣ Kembalikan budget plan ke kondisi sebelum transaksi ini dibuat
    await prisma.budgetPlanOpex.update({
      where: { id: trx.budgetPlanOpexId },
      data: {
        budgetRealisasiAmount: {
          decrement: trx.amount, // Kurangi realisasi
        },
        budgetRemainingAmount: {
          increment: trx.amount, // Tambah sisa budget
        },
      },
    });

    // 3️⃣ Hapus transaksi
    await prisma.transactionOpex.delete({
      where: { id: trx.id },
    });

    return NextResponse.json({ 
      success: true,
      message: "Transaksi berhasil dihapus dan budget plan dikembalikan"
    });
  } catch (err) {
    console.error("[DELETE TRANSACTION OPEX ERROR]", err);
    return NextResponse.json(
      { error: "Gagal menghapus transaksi" },
      { status: 500 }
    );
  }
}