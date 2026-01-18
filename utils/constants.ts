// Environment Variables Constants
// This file centralizes all environment variable references

// Validate that we're in a Node.js environment
if (typeof process === "undefined") {
  throw new TypeError("This module can only be used in a Node.js environment");
}

export const ENV = {
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL!,

  // NextAuth Configuration
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,

  // ImageKit Configuration
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY!,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY!,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT!,

  // Email Service Configuration (SMTP)
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,
  EMAIL_FROM: process.env.EMAIL_FROM || '"Zebotix WBAs" <noreply@zebotix.com>',

  // Zillow API Configuration
  ZILLOW_API_KEY: process.env.ZILLOW_API_KEY!,
  SESSION_STRATEGY: process.env.SESSION_STRATEGY || "jwt",
} as const;

// Type safety for environment variables
export type EnvKeys = keyof typeof ENV;

// Helper function to validate environment variables
export const validateEnvVars = () => {
  const missingVars: string[] = [];

  Object.entries(ENV).forEach(([key, value]) => {
    if (!value) {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
};
