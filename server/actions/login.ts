"use server";

import db from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { LoginSchema } from "@/types/login-schema";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { signIn } from "../auth";

export const LoginAccount = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    console.log("Login attempt for email:", email);

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user?.password) {
      console.log("User not found or no password");
      return { error: "Invalid email or password" };
    }

    console.log("User found:", {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    });

    // Check if email is verified (allow existing users to continue)
    // For new registrations, email verification will be enforced
    // if (!user.emailVerified) {
    //   return { error: 'Please verify your email address before logging in' };
    // }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password mismatch");
      return { error: "Invalid email or password" };
    }

    // Check if the user is trying to access admin routes
    const headersList = await headers();
    const referer = headersList.get("referer") || "";
    const isAdminRoute = referer.includes("/admin");

    console.log("Referer:", referer, "isAdminRoute:", isAdminRoute);

    // If trying to access admin routes, verify the user is an admin
    if (isAdminRoute && user.role !== "admin") {
      console.log("Non-admin trying to access admin route");
      return { error: "You do not have permission to access the admin area" };
    }

    try {
      console.log("Attempting sign in...");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("SignIn result:", result);
      return { success: "Login successful" };
    } catch (error) {
      console.error("Login error:", error);
      return { error: "Login failed. Please try again." };
    }
  });
