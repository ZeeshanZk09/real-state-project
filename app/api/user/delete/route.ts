// app/api/user/delete/route.ts
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await request.json();

  await db.user.delete({
    where: { id: userId },
  });
  // Also delete from accounts table if using OAuth

  return NextResponse.json({ success: true });
}
