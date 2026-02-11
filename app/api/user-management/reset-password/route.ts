import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

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

    // Log activity
    await prisma.activity_logs.create({
      data: {
        actor_username: "admin", // TODO: Get from session
        action: "RESET_PASSWORD",
        module: "USER_MANAGEMENT",
        target_type: "users",
        target_id: userId,
        description: `Password reset for user: ${user.username}`,
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