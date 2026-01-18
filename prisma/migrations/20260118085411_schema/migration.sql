-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('Buyer', 'Seller', 'Advanced', 'Expert', 'Master');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "location" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT DEFAULT 'no-image',
    "password" TEXT,
    "skillLevel" "SkillLevel" NOT NULL DEFAULT 'Buyer',
    "role" "Role" NOT NULL DEFAULT 'user',
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL,
    "zpid" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "propdetails" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "imageUrl" VARCHAR(500) NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "sqft" INTEGER NOT NULL,
    "LotSize" INTEGER NOT NULL,
    "HOADues" INTEGER NOT NULL,
    "YearBuilt" INTEGER NOT NULL,
    "GarageSqFt" INTEGER NOT NULL,
    "BasementSqFt" INTEGER NOT NULL,
    "propertyType" VARCHAR(255) NOT NULL,
    "isForSale" BOOLEAN NOT NULL DEFAULT true,
    "appliances" VARCHAR(255),
    "basement" VARCHAR(50),
    "floorCovering" VARCHAR(255),
    "coolingType" VARCHAR(255),
    "heatingType" VARCHAR(255),
    "heatingFuel" VARCHAR(255),
    "rooms" VARCHAR(255),
    "indoorFeatures" VARCHAR(255),
    "buildingAmenities" VARCHAR(255),
    "architecturalStyle" VARCHAR(255),
    "exterior" VARCHAR(255),
    "outdoorAmenities" VARCHAR(255),
    "parking" VARCHAR(255),
    "roof" VARCHAR(255),
    "view" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_details" (
    "id" SERIAL NOT NULL,
    "zpid" VARCHAR(50) NOT NULL,
    "walkScore" INTEGER,
    "transitScore" INTEGER,
    "bikeScore" INTEGER,
    "yearBuilt" INTEGER,
    "taxHistory" JSONB,
    "priceHistory" JSONB,
    "zestimate" INTEGER,
    "rentalEstimate" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" SERIAL NOT NULL,
    "zpid" VARCHAR(50) NOT NULL,
    "imageUrl" VARCHAR(500) NOT NULL,
    "type" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_properties" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_token_key" ON "verification_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "properties_zpid_key" ON "properties"("zpid");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_details" ADD CONSTRAINT "property_details_zpid_fkey" FOREIGN KEY ("zpid") REFERENCES "properties"("zpid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_zpid_fkey" FOREIGN KEY ("zpid") REFERENCES "properties"("zpid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_properties" ADD CONSTRAINT "saved_properties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_properties" ADD CONSTRAINT "saved_properties_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
