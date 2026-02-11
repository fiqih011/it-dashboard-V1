import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

/* =========================
   Utils
========================= */
function generatePassword() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/* =========================
   GET — LIST USERS
========================= */
export async function GET() {
  try {
    const users = await prisma.$queryRawUnsafe<
      {
        id: string;
        username: string;
        fullName: string;
        role: string;
        status: string;
        lastLogin: string | null;
      }[]
    >(`
      SELECT
        id,
        username,
        full_name       AS "fullName",
        INITCAP(role)   AS role,
        INITCAP(status) AS status,
        TO_CHAR(last_login_at, 'YYYY-MM-DD HH24:MI') AS "lastLogin"
      FROM users
      ORDER BY created_at DESC
    `);

    return NextResponse.json(users);
  } catch (error) {
    console.error("LIST USERS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/* =========================
   POST — CREATE USER
========================= */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, fullName, role, status } = body;

    if (!username || !fullName || !role || !status) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    // 🔒 NORMALIZATION (WAJIB)
    const normalizedRole = String(role).toLowerCase();
    const normalizedStatus = String(status).toLowerCase();

    // 🔒 VALIDATION (ANTI DB ERROR)
    if (!["admin", "user"].includes(normalizedRole)) {
      return NextResponse.json(
        { message: "Invalid role value" },
        { status: 400 }
      );
    }

    if (!["active", "inactive"].includes(normalizedStatus)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const exists = await prisma.users.findUnique({
      where: { username },
    });

    if (exists) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }

    const plainPassword = generatePassword();
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const now = new Date();
    const passwordExpiresAt =
      normalizedRole === "admin"
        ? null
        : new Date(new Date().setMonth(now.getMonth() + 3));

    const user = await prisma.users.create({
      data: {
        username,
        full_name: fullName,
        role: normalizedRole,          // ✅ FIX
        status: normalizedStatus,      // ✅ FIX
        password_hash: passwordHash,
        force_change_password: true,
        password_expires_at: passwordExpiresAt,
      },
    });

    await prisma.activity_logs.create({
      data: {
        actor_username: "admin", // nanti ambil dari session
        action: "CREATE_USER",
        module: "USER_MANAGEMENT",
        target_type: "users",
        target_id: user.id,
        description: `Created user ${username}`,
      },
    });

    return NextResponse.json({
      id: user.id,
      username,
      temporaryPassword: plainPassword,
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
