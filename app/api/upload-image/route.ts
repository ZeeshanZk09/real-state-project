import { imageKit } from '@/lib/imagekit';
import db from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/server/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { files, details } = body;

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ success: false, error: 'Invalid files input.' }, { status: 400 });
    }

    if (!details) {
      return NextResponse.json({ success: false, error: 'Details are required.' }, { status: 400 });
    }

    const uploadedImages = await Promise.all(
      files.map(async (file: string, index: number) => {
        // Upload image to ImageKit
        const uploadResponse = await imageKit.upload({
          file,
          fileName: `image-${Date.now()}-${index}`,
          folder: 'uploads',
        });

        // Generate zpid (fallback to UUID if not provided)
        const zpid = details.zpid || uuidv4();

        // Insert property into the database with owner tracking
        const newImage = await db.property.create({
          data: {
            zpid,
            title: details.title,
            description: details.description,
            propdetails: details.propdetails,
            price: details.price,
            location: details.location,
            imageUrl: uploadResponse.url,
            bedrooms: details.bedrooms,
            bathrooms: details.bathrooms,
            sqft: details.sqft,
            LotSize: details.sqft,
            HOADues: details.HOADues,
            YearBuilt: details.YearBuilt,
            GarageSqFt: details.GarageSqFt,
            BasementSqFt: details.BasementSqFt,
            propertyType: details.propertyType,
            isForSale: details.isForSale,
            status: 'pending', // New properties require approval
            ownerId: session.user.id, // Set owner from session
            basement: details.basement || null,
            floorCovering: details.floorCovering?.join(',') || null,
            coolingType: details.coolingType?.join(',') || null,
            heatingType: details.heatingType?.join(',') || null,
            heatingFuel: details.heatingFuel?.join(',') || null,
            rooms: details.rooms?.join(',') || null,
            indoorFeatures: details.indoorFeatures?.join(',') || null,
            buildingAmenities: details.buildingAmenities?.join(',') || null,
            architecturalStyle: details.architecturalStyle || null,
            exterior: details.exterior?.join(',') || null,
            outdoorAmenities: details.outdoorAmenities?.join(',') || null,
            parking: details.parking?.join(',') || null,
            roof: details.roof?.join(',') || null,
            view: details.view?.join(',') || null,
          },
        });

        // Return uploaded image details
        return {
          id: newImage.id,
          fileName: uploadResponse.name,
          fileUrl: uploadResponse.url,
          title: details.title,
          description: details.description,
        };
      })
    );

    return NextResponse.json({
      success: true,
      uploadedImages,
      message: 'Property submitted for admin approval',
    });
  } catch (error) {
    console.error('Error uploading images or inserting data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload images or insert data.',
      },
      { status: 500 }
    );
  }
}
