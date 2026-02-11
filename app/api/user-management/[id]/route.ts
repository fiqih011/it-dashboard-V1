import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params is Promise
) {
  try {
    const { id } = await context.params; // ✅ AWAIT params
    const { fullName, role, status } = await req.json();

    console.log("=== UPDATE USER REQUEST ===");
    console.log("User ID:", id);
    console.log("Data:", { fullName, role, status });

    // Validate
    if (!fullName || !role || !status) {
      return NextResponse.json(
        { message: "Full name, role, and status are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id },
    });

    console.log("Existing user:", existingUser);

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Prevent deactivating admin
    if (role === "Admin" && status === "Inactive") {
      return NextResponse.json(
        { message: "Administrator accounts cannot be deactivated" },
        { status: 403 }
      );
    }

    // Check if last admin
    if (existingUser.role === "admin" && role === "User") {
      const adminCount = await prisma.users.count({
        where: { role: "admin" },
      });

      if (adminCount === 1) {
        return NextResponse.json(
          { message: "Cannot change role of the last administrator" },
          { status: 403 }
        );
      }
    }

    // Normalize to lowercase
    const normalizedRole = role.toLowerCase();
    const normalizedStatus = status.toLowerCase();

    console.log("Updating with:", {
      full_name: fullName,
      role: normalizedRole,
      status: normalizedStatus,
    });

    // Update user
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        full_name: fullName,
        role: normalizedRole,
        status: normalizedStatus,
        updated_at: new Date(),
      },
    });

    console.log("Update successful:", updatedUser);

    // Log activity
    try {
      await prisma.activity_logs.create({
        data: {
          actor_username: "admin",
          action: "UPDATE_USER",
          module: "USER_MANAGEMENT",
          target_type: "users",
          target_id: id,
          description: `Updated user: ${updatedUser.username}`,
        },
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("=== UPDATE USER ERROR ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : error);
    
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params is Promise
) {
  try {
    const { id } = await context.params; // ✅ AWAIT params

    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.role === "admin") {
      return NextResponse.json(
        { message: "Administrator accounts cannot be deleted" },
        { status: 403 }
      );
    }

    await prisma.users.delete({
      where: { id },
    });

    try {
      await prisma.activity_logs.create({
        data: {
          actor_username: "admin",
          action: "DELETE_USER",
          module: "USER_MANAGEMENT",
          target_type: "users",
          target_id: id,
          description: `Deleted user: ${user.username}`,
        },
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}