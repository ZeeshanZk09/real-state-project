import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check if the current user is an admin
    const session = await auth();
    if (
      !session ||
      !session.user ||
      !("role" in session.user) ||
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Update the user's role to admin
    await db.user.update({
      where: { id: userId },
      data: { role: "admin" },
    });

    return NextResponse.json({
      success: true,
      message: "User promoted to admin",
    });
  } catch (error) {
    console.error("Error promoting user:", error);
    return NextResponse.json(
      { error: "Failed to promote user" },
      { status: 500 },
    );
  }
}
