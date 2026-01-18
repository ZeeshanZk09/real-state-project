// Migration script to set emailVerified for existing users
import prisma from "../lib/prisma";

async function migrateEmailVerified() {
  console.log("🔄 Updating emailVerified for existing users...");

  try {
    const result = await prisma.user.updateMany({
      where: {
        emailVerified: null,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    console.log(`✅ Updated ${result.count} users with emailVerified field`);
  } catch (error) {
    console.error("❌ Error updating users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
migrateEmailVerified();

export default migrateEmailVerified;
