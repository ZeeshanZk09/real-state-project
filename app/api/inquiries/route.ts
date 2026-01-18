import { auth } from "@/server/auth";
import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import {
  createOwnerNotificationTemplate,
  createInquiryConfirmationTemplate,
} from "@/lib/email-templates";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get("propertyId");

    if (propertyId) {
      // Get inquiries for a specific property
      const property = await db.property.findUnique({
        where: { id: Number(propertyId) },
      });

      if (!property) {
        return NextResponse.json(
          { error: "Property not found" },
          { status: 404 },
        );
      }

      // Check ownership
      if (property.ownerId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
        orderBy: { createdAt: "desc" },
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { propertyId, name, email, phone, message } = body;

    if (!propertyId || !name || !email || !message) {
      return NextResponse.json(
        { error: "Property ID, name, email, and message are required" },
        { status: 400 },
      );
    }

    // Verify property exists and get property details with owner info
    const property = await db.property.findUnique({
      where: { id: Number(propertyId) },
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

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }

    // Create the inquiry in database
    const newInquiry = await db.inquiry.create({
      data: {
        propertyId: Number(propertyId),
        senderId: session.user.id,
        name,
        email,
        phone: phone || null,
        message,
        status: "unread",
      },
    });

    // Send email notifications
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const propertyUrl = `${baseUrl}/Properties/${property.id}`;
      const dashboardUrl = `${baseUrl}/dashboard/inquiries`;

      // Email to property owner
      const ownerEmailResult = await sendEmail({
        to: property.owner.email,
        subject: `New Inquiry for ${property.title}`,
        html: createOwnerNotificationTemplate({
          ownerName: `${property.owner.firstName} ${property.owner.lastName}`,
          propertyTitle: property.title,
          inquirerName: name,
          inquirerEmail: email,
          inquirerPhone: phone,
          message,
          dashboardUrl,
        }),
      });

      // Confirmation email to inquirer
      const inquirerEmailResult = await sendEmail({
        to: email,
        subject: `Inquiry Confirmation - ${property.title}`,
        html: createInquiryConfirmationTemplate({
          propertyTitle: property.title,
          propertyLocation: property.location,
          propertyPrice: property.price,
          inquirerName: name,
          inquirerEmail: email,
          inquirerPhone: phone,
          message,
          propertyUrl,
          propertyImage: property.imageUrl,
        }),
      });

      // Log email results
      if (!ownerEmailResult.success) {
        console.error(
          "Failed to send email to property owner:",
          ownerEmailResult.error,
        );
      }

      if (!inquirerEmailResult.success) {
        console.error(
          "Failed to send confirmation email to inquirer:",
          inquirerEmailResult.error,
        );
      }
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Don't fail the inquiry creation if email fails
    }

    return NextResponse.json(
      {
        message: "Inquiry sent successfully!",
        inquiry: newInquiry,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 },
      );
    }

    // Verify user owns the property
    const inquiry = await db.inquiry.findUnique({
      where: { id: Number(id) },
      include: { property: true },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    if (inquiry.property.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedInquiry = await db.inquiry.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({
      message: "Inquiry updated successfully!",
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
