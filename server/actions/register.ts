"use server";

import db from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { RegisterSchema } from "@/types/register-schema";
import bcrypt from "bcryptjs";
export const RegisterAccount = actionClient
  .schema(RegisterSchema)
  .action(
    async ({
      parsedInput: {
        email,
        password,
        lastName,
        firstName,
        location,
        role,
        skillLevel,
      },
    }) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return {
          error: "Looks like you already have an account. Please log in.",
        };
      }

      await db.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          location: location,
          email: email,
          password: hashedPassword,
          role: role,
          skillLevel: skillLevel,
          emailVerified: new Date(), // Set email as verified for development purposes
        },
      });

      return { success: "Account created successfully" };
    },
  );
