import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.users.findMany({
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      username: u.username,
      fullName: u.full_name,
      role: u.role,
      status: u.status === "active" ? "Active" : "Inactive",
      lastLogin: u.last_login_at
        ? u.last_login_at.toISOString().slice(0, 16).replace("T", " ")
        : null,
    }))
  );
}
