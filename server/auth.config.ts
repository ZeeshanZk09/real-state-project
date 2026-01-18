// /auth.config.ts

import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import prisma from "../lib/prisma";

export const authConfig = {
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (
        isLoggedIn &&
        (nextUrl.pathname === "/auth/sign-in" ||
          nextUrl.pathname === "/auth/sign-up")
      ) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "VISITOR" | "USER" | "ADMIN";
      }
      return session;
    },
  },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const email = credentials.email as string;

        const user = await prisma.user.findUnique({
          where: { email: email },
        });
        if (!user?.password) {
          return null;
        }

        if (!user.emailVerified) {
          return null;
        }
        const isValid = await compare(
          credentials.password as string,
          user.password,
        );
        if (!isValid) {
          return null;
        }
        console.log("user ahmade: ", user);
        // Map role from Prisma enum to NextAuth role
        const mappedRole =
          user.role === "admin" ? ("ADMIN" as const) : ("USER" as const);

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
          role: mappedRole,
        } as any;
      },
    }),
  ],
} satisfies NextAuthConfig;
