import "next-auth";

declare module "next-auth" {
  interface User {
    role: "user" | "admin";
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: (typeof RoleEnum.enumValues)[number];
    id: string;
  }
}
