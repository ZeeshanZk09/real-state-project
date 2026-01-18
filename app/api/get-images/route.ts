import { db } from '@/server/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const allImages = await db.propertyImage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(allImages);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images.' }, { status: 500 });
  }
}
