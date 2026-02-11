import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword, confirmPassword } = await req.json();
  if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const userId = (session.user as any).id;

  const rows = await prisma.$queryRawUnsafe<any[]>(
    `SELECT * FROM users WHERE id = $1 LIMIT 1`,
    userId
  );
  const user = rows[0];

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) {
    return NextResponse.json({ message: "Wrong password" }, { status: 400 });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  const now = new Date();
  const expires =
    user.role === "admin"
      ? null
      : new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  await prisma.$executeRawUnsafe(
    `
    UPDATE users
    SET password_hash = $1,
        force_change_password = false,
        password_expires_at = $2,
        last_password_change_at = $3
    WHERE id = $4
  `,
    hash,
    expires,
    now,
    userId
  );

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO activity_logs
    (actor_id, actor_username, action, module, created_at)
    VALUES ($1, $2, 'CHANGE_PASSWORD', 'AUTH', $3)
  `,
    user.id,
    user.username,
    now
  );

  return NextResponse.json({ success: true });
}
