import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { message: "User ID and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
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

    // Hash password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password (admin password tidak expire)
    await prisma.users.update({
      where: { id: userId },
      data: {
        password_hash: passwordHash,
        force_change_password: false,
        password_expires_at: null, // Admin password tidak expire
        updated_at: new Date(),
      },
    });

    // Log activity
    await prisma.activity_logs.create({
      data: {
        actor_username: "admin", // TODO: Get from session
        action: "CHANGE_PASSWORD",
        module: "USER_MANAGEMENT",
        target_type: "users",
        target_id: userId,
        description: `Password changed for admin: ${user.username}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Password changed for ${user.username}`,
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}