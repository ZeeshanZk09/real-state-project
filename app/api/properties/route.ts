import db from '@/lib/prisma';
import type { Property } from '@/generated/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const ownerId = searchParams.get('ownerId');

    const where: any = {};

    // Search by location
    if (search) {
      where.location = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Filter by approval status (for admin)
    if (status) {
      where.status = status;
    } else {
      // By default, only show approved properties
      const session = await auth();
      if (!session || session.user.role !== 'admin') {
        where.status = 'approved';
      }
    }

    // Filter by owner (for user's own properties)
    if (ownerId) {
      where.ownerId = ownerId;
    }

    const data: Property[] = await db.property.findMany({
      where,
      take: 50,
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
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 });
    }

    const body = await request.json();
    const propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = {
      ...body,
      ownerId: session.user.id,
      status: 'pending', // New properties require approval
    };

    const newProperty = await db.property.create({ data: propertyData });

    return NextResponse.json(
      {
        message: 'Property submitted for approval!',
        property: newProperty,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...property } = body;

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Check ownership
    const existingProperty = await db.property.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Only owner or admin can update
    if (existingProperty.ownerId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedProperty = await db.property.update({
      where: { id: Number(id) },
      data: property,
    });

    return NextResponse.json({
      message: 'Property updated successfully!',
      property: updatedProperty,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Check ownership
    const existingProperty = await db.property.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Only owner or admin can delete
    if (existingProperty.ownerId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.property.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Property deleted successfully!' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
