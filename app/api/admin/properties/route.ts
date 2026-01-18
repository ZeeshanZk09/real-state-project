import db from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { PropertyStatus } from '@/generated/enums';
import { auth } from '@/server/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access only' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = (searchParams.get('status') || 'pending') as PropertyStatus;

    const properties = await db.property.findMany({
      where: { status: status },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access only' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Property ID and status are required' }, { status: 400 });
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedProperty = await db.property.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({
      message: `Property ${status} successfully!`,
      property: updatedProperty,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }
}
