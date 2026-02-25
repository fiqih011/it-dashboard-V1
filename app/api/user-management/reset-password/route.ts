import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

function generatePassword(): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("userId" in body) ||
      typeof body.userId !== "string" ||
      body.userId.trim() === ""
    ) {
      return NextResponse.json(
        { message: "Invalid User ID" },
        { status: 400 }
      );
    }

    const userId = body.userId;

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Generate new password
    const newPassword = generatePassword();
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Set expiration (3 months from now)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3);

    // Update user
    await prisma.users.update({
      where: { id: userId },
      data: {
        password_hash: passwordHash,
        force_change_password: true,
        password_expires_at: expiresAt,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      temporaryPassword: newPassword,
      message: `Password reset for ${user.username}`,
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
