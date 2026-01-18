import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.inquiry.deleteMany();
  await prisma.savedProperty.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.propertyDetail.deleteMany();
  await prisma.property.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  console.log("👤 Creating admin user...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "zebotix@gmail.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      emailVerified: new Date(),
      location: "New York, NY",
      skillLevel: "Expert",
    },
  });

  // Create regular users
  console.log("👥 Creating regular users...");
  const userPassword = await bcrypt.hash("user123", 10);

  const user1 = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      password: userPassword,
      firstName: "John",
      lastName: "Doe",
      role: "user",
      emailVerified: new Date(),
      location: "Los Angeles, CA",
      skillLevel: "Buyer",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane.smith@example.com",
      password: userPassword,
      firstName: "Jane",
      lastName: "Smith",
      role: "user",
      emailVerified: new Date(),
      location: "Chicago, IL",
      skillLevel: "Seller",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "mike.johnson@example.com",
      password: userPassword,
      firstName: "Mike",
      lastName: "Johnson",
      role: "user",
      emailVerified: new Date(),
      location: "Houston, TX",
      skillLevel: "Advanced",
    },
  });

  // Create properties
  console.log("🏠 Creating properties...");

  const properties = await Promise.all([
    prisma.property.create({
      data: {
        zpid: "prop-001",
        title: "Luxury Modern Villa",
        description:
          "Beautiful modern villa with stunning ocean views. Features include infinity pool, home theater, and smart home automation.",
        propdetails:
          "This stunning property offers the perfect blend of luxury and comfort. With floor-to-ceiling windows, you can enjoy breathtaking views of the Pacific Ocean from every room.",
        price: 2500000,
        location: "123 Ocean Drive, Malibu, CA 90265",
        imageUrl:
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        bedrooms: 5,
        bathrooms: 4,
        sqft: 4500,
        LotSize: 8000,
        HOADues: 500,
        YearBuilt: 2020,
        GarageSqFt: 800,
        BasementSqFt: 1200,
        propertyType: "Single Family",
        isForSale: true,
        status: "approved",
        ownerId: user1.id,
        basement: "Finished",
        floorCovering: "Hardwood,Marble",
        coolingType: "Central Air",
        heatingType: "Central",
        heatingFuel: "Gas",
        rooms: "Living Room,Dining Room,Kitchen,Master Suite,Home Theater",
        indoorFeatures: "Walk-in Closet,High Ceilings,Smart Home",
        buildingAmenities: "Elevator,Gym,Pool",
        architecturalStyle: "Modern",
        exterior: "Stone,Glass",
        outdoorAmenities: "Pool,Spa,Outdoor Kitchen",
        parking: "Attached Garage",
        roof: "Tile",
        view: "Ocean,Mountain",
      },
    }),
    prisma.property.create({
      data: {
        zpid: "prop-002",
        title: "Downtown Luxury Condo",
        description:
          "Sophisticated high-rise condo in the heart of downtown with panoramic city views.",
        propdetails:
          "Experience urban living at its finest in this beautifully appointed penthouse suite. Floor-to-ceiling windows showcase stunning city skyline views.",
        price: 1200000,
        location: "456 Park Avenue, New York, NY 10022",
        imageUrl:
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 2200,
        LotSize: 2200,
        HOADues: 1200,
        YearBuilt: 2018,
        GarageSqFt: 0,
        BasementSqFt: 0,
        propertyType: "Condo",
        isForSale: true,
        status: "approved",
        ownerId: user2.id,
        floorCovering: "Hardwood,Tile",
        coolingType: "Central Air",
        heatingType: "Central",
        heatingFuel: "Electric",
        rooms: "Living Room,Dining Room,Kitchen,Master Suite,Office",
        indoorFeatures: "Walk-in Closet,High Ceilings,Modern Kitchen",
        buildingAmenities: "Doorman,Gym,Pool,Rooftop Deck",
        architecturalStyle: "Contemporary",
        exterior: "Glass,Steel",
        parking: "Valet,Underground",
        view: "City,River",
      },
    }),
    prisma.property.create({
      data: {
        zpid: "prop-003",
        title: "Charming Suburban Home",
        description:
          "Perfect family home in quiet suburban neighborhood with excellent schools.",
        propdetails:
          "This beautiful home offers comfortable family living with a spacious backyard, updated kitchen, and finished basement perfect for entertaining.",
        price: 650000,
        location: "789 Maple Street, Austin, TX 78701",
        imageUrl:
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 3200,
        LotSize: 6500,
        HOADues: 150,
        YearBuilt: 2015,
        GarageSqFt: 500,
        BasementSqFt: 1000,
        propertyType: "Single Family",
        isForSale: true,
        status: "approved",
        ownerId: user3.id,
        basement: "Finished",
        floorCovering: "Carpet,Hardwood",
        coolingType: "Central Air",
        heatingType: "Central",
        heatingFuel: "Gas",
        rooms: "Living Room,Dining Room,Kitchen,Family Room,Master Suite",
        indoorFeatures: "Walk-in Closet,Fireplace,Updated Kitchen",
        buildingAmenities: "Community Pool",
        architecturalStyle: "Traditional",
        exterior: "Brick,Siding",
        outdoorAmenities: "Deck,Fenced Yard,Garden",
        parking: "Attached Garage,Driveway",
        roof: "Shingle",
        view: "Garden,Street",
      },
    }),
    prisma.property.create({
      data: {
        zpid: "prop-004",
        title: "Beachfront Paradise",
        description:
          "Stunning beachfront property with direct ocean access and private beach.",
        propdetails:
          "Wake up to the sound of waves in this incredible oceanfront estate. Features include private beach access, infinity pool, and outdoor entertainment area.",
        price: 3800000,
        location: "321 Beach Road, Miami, FL 33139",
        imageUrl:
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        bedrooms: 6,
        bathrooms: 5,
        sqft: 5500,
        LotSize: 12000,
        HOADues: 800,
        YearBuilt: 2019,
        GarageSqFt: 1000,
        BasementSqFt: 0,
        propertyType: "Single Family",
        isForSale: true,
        status: "approved",
        ownerId: user1.id,
        floorCovering: "Marble,Hardwood",
        coolingType: "Central Air,Ceiling Fans",
        heatingType: "Central",
        heatingFuel: "Electric",
        rooms:
          "Living Room,Dining Room,Kitchen,Master Suite,Guest Suites,Media Room",
        indoorFeatures:
          "Walk-in Closet,High Ceilings,Gourmet Kitchen,Wine Cellar",
        buildingAmenities: "Private Beach,Security",
        architecturalStyle: "Mediterranean",
        exterior: "Stucco,Stone",
        outdoorAmenities: "Pool,Spa,Outdoor Kitchen,Private Beach",
        parking: "Attached Garage,Circular Driveway",
        roof: "Tile",
        view: "Ocean,Beach",
      },
    }),
    prisma.property.create({
      data: {
        zpid: "prop-005",
        title: "Mountain Retreat",
        description:
          "Secluded mountain cabin with breathtaking views and modern amenities.",
        propdetails:
          "Escape to nature in this luxurious mountain retreat. Featuring floor-to-ceiling windows, stone fireplace, and wraparound deck with stunning mountain views.",
        price: 895000,
        location: "555 Mountain View Lane, Aspen, CO 81611",
        imageUrl:
          "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 3800,
        LotSize: 15000,
        HOADues: 200,
        YearBuilt: 2017,
        GarageSqFt: 600,
        BasementSqFt: 800,
        propertyType: "Single Family",
        isForSale: true,
        status: "approved",
        ownerId: user2.id,
        basement: "Finished",
        floorCovering: "Hardwood,Stone",
        coolingType: "Central Air",
        heatingType: "Central,Fireplace",
        heatingFuel: "Gas,Wood",
        rooms: "Living Room,Dining Room,Kitchen,Master Suite,Loft",
        indoorFeatures: "Vaulted Ceilings,Stone Fireplace,Gourmet Kitchen",
        architecturalStyle: "Rustic Contemporary",
        exterior: "Wood,Stone",
        outdoorAmenities: "Deck,Hot Tub,Fire Pit",
        parking: "Attached Garage",
        roof: "Metal",
        view: "Mountain,Forest",
      },
    }),
    // Pending property (requires admin approval)
    prisma.property.create({
      data: {
        zpid: "prop-006",
        title: "Newly Listed Downtown Loft",
        description: "Industrial-chic loft in converted warehouse building.",
        propdetails:
          "Unique loft space with exposed brick, high ceilings, and modern finishes. Perfect for artists or creative professionals.",
        price: 750000,
        location: "888 Industrial Blvd, Seattle, WA 98101",
        imageUrl:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1800,
        LotSize: 1800,
        HOADues: 400,
        YearBuilt: 2021,
        GarageSqFt: 0,
        BasementSqFt: 0,
        propertyType: "Loft",
        isForSale: true,
        status: "pending",
        ownerId: user3.id,
        floorCovering: "Concrete,Hardwood",
        coolingType: "Central Air",
        heatingType: "Central",
        heatingFuel: "Electric",
        rooms: "Open Concept Living,Kitchen,Master Suite",
        indoorFeatures: "Exposed Brick,High Ceilings,Modern Kitchen",
        buildingAmenities: "Gym,Bike Storage,Rooftop Deck",
        architecturalStyle: "Industrial",
        exterior: "Brick,Concrete",
        parking: "Street",
        view: "City",
      },
    }),
  ]);

  console.log(`✅ Created ${properties.length} properties`);

  // Create inquiries
  console.log("💬 Creating inquiries...");

  await Promise.all([
    prisma.inquiry.create({
      data: {
        propertyId: properties[0].id,
        senderId: user2.id,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "555-0102",
        message:
          "I am very interested in this property. Could we schedule a viewing this weekend?",
        status: "unread",
      },
    }),
    prisma.inquiry.create({
      data: {
        propertyId: properties[1].id,
        senderId: user3.id,
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        phone: "555-0103",
        message:
          "What are the HOA fees and what do they cover? Also, is there parking available?",
        status: "read",
      },
    }),
    prisma.inquiry.create({
      data: {
        propertyId: properties[2].id,
        senderId: user1.id,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "555-0101",
        message:
          "Is this property still available? I would like to make an offer.",
        status: "unread",
      },
    }),
  ]);

  console.log("✅ Created 3 inquiries");

  // Create saved properties
  console.log("⭐ Creating saved properties...");

  await Promise.all([
    prisma.savedProperty.create({
      data: {
        userId: user1.id,
        propertyId: properties[1].id,
      },
    }),
    prisma.savedProperty.create({
      data: {
        userId: user1.id,
        propertyId: properties[4].id,
      },
    }),
    prisma.savedProperty.create({
      data: {
        userId: user2.id,
        propertyId: properties[0].id,
      },
    }),
    prisma.savedProperty.create({
      data: {
        userId: user3.id,
        propertyId: properties[2].id,
      },
    }),
  ]);

  console.log("✅ Created 4 saved properties");

  console.log("\n🎉 Database seeding completed successfully!\n");
  console.log("📧 Login credentials:");
  console.log("   Admin: zebotix@gmail.com / admin123");
  console.log("   User1: john.doe@example.com / user123");
  console.log("   User2: jane.smith@example.com / user123");
  console.log("   User3: mike.johnson@example.com / user123\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
