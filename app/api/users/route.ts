import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if the current user is an admin
    const session = await auth();

    if (!session || !session.user || !('role' in session.user) || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page') || 1);
    const search = searchParams.get('search') || '';
    const limit = 10; // Number of users per page
    const skip = (page - 1) * limit;

    // Fetch users with pagination and search
    const [users, totalUsers] = await Promise.all([
      db.user.findMany({
        where: {
          firstName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
      }),
      db.user.count({
        where: {
          firstName: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return NextResponse.json({
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
