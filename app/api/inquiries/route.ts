import { auth } from '@/server/auth';
import db from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId');

    if (propertyId) {
      // Get inquiries for a specific property
      const property = await db.property.findUnique({
        where: { id: Number(propertyId) },
      });

      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }

      // Check ownership
      if (property.ownerId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const inquiries = await db.inquiry.findMany({
        where: { propertyId: Number(propertyId) },
        include: {
          sender: {
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

      return NextResponse.json(inquiries);
    }

    // Get all inquiries sent by the user
    const inquiries = await db.inquiry.findMany({
      where: { senderId: session.user.id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            location: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(inquiries);
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
    const { propertyId, name, email, phone, message } = body;

    if (!propertyId || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Property ID, name, email, and message are required' },
        { status: 400 }
      );
    }

    // Verify property exists
    const property = await db.property.findUnique({
      where: { id: Number(propertyId) },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const newInquiry = await db.inquiry.create({
      data: {
        propertyId: Number(propertyId),
        senderId: session.user.id,
        name,
        email,
        phone: phone || null,
        message,
        status: 'unread',
      },
    });

    return NextResponse.json(
      {
        message: 'Inquiry sent successfully!',
        inquiry: newInquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    // Verify user owns the property
    const inquiry = await db.inquiry.findUnique({
      where: { id: Number(id) },
      include: { property: true },
    });

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    if (inquiry.property.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedInquiry = await db.inquiry.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({
      message: 'Inquiry updated successfully!',
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
