'use server';

import { actionClient } from '@/lib/safe-action';
import { LoginSchema } from '@/types/login-schema';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { signIn } from '../auth';
import db from '@/lib/prisma';
export const LoginAccount = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return { error: 'Invalid email or password' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: 'Invalid email or password' };
    }

    // Check if the user is trying to access admin routes
    const headersList = await headers();
    const referer = headersList.get('referer') || '';
    const isAdminRoute = referer.includes('/admin');

    // If trying to access admin routes, verify the user is an admin
    if (isAdminRoute && user.role !== 'admin') {
      return { error: 'You do not have permission to access the admin area' };
    }

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: 'Login successful' };
  });
