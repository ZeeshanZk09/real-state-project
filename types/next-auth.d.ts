import 'next-auth';
import type { User as u } from '@/generated/client';

declare module 'next-auth' {
  interface User extends u {}

  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: (typeof RoleEnum.enumValues)[number];
    id: string;
  }
}
