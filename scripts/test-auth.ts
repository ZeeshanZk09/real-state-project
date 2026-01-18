// Test script to check authentication flow
import { signIn } from "@/server/auth";

export async function testLogin() {
  try {
    const result = await signIn("credentials", {
      email: "zebotix@gmail.com", // Using seeded admin user
      password: "admin123",
      redirect: false,
    });

    console.log("Test login result:", result);
    return result;
  } catch (error) {
    console.error("Test login error:", error);
    return { error: "Login test failed" };
  }
}

// Debug function to check user data
export async function debugUserAuth(email: string) {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
      },
    });

    console.log("User data:", user);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
