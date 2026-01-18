# Environment Variables Reorganization

This project has been refactored to centralize environment variable management using the following structure:

## Files Created

### 1. `/utils/constants.ts`

- Centralizes all environment variable references
- Provides type safety for environment variables
- Includes validation function to check for missing variables
- Contains all required environment variables in a single `ENV` object

### 2. `.env`

- Contains actual environment variable values (should be kept private)
- Replace placeholder values with your actual API keys and credentials

### 3. `.env.example`

- Template file showing required environment variables
- Safe to commit to version control
- Provides guidance on where to obtain API keys

## Environment Variables Used

| Variable                | Purpose                               | Where to get                                                           |
| ----------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| `DATABASE_URL`          | PostgreSQL database connection string | Your database provider                                                 |
| `NEXTAUTH_SECRET`       | NextAuth encryption secret            | Generate with: `openssl rand -base64 32`                               |
| `IMAGEKIT_PUBLIC_KEY`   | ImageKit public key                   | [ImageKit Dashboard](https://imagekit.io/dashboard/developer/api-keys) |
| `IMAGEKIT_PRIVATE_KEY`  | ImageKit private key                  | [ImageKit Dashboard](https://imagekit.io/dashboard/developer/api-keys) |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint                 | [ImageKit Dashboard](https://imagekit.io/dashboard/developer/api-keys) |
| `RESEND_API_KEY`        | Resend email service API key          | [Resend API Keys](https://resend.com/api-keys)                         |
| `ZILLOW_API_KEY`        | Zillow API key for property data      | [RapidAPI Zillow](https://rapidapi.com/s.mahmoud97/api/zillow-com1)    |

## Updated Files

The following files have been updated to use the centralized constants:

1. `/lib/imagekit.ts` - ImageKit configuration
2. `/lib/email.ts` - Email service configuration
3. `/lib/zillowClient.ts` - Zillow API client
4. `/server/db.ts` - Database connection
5. `/server/auth.ts` - NextAuth configuration
6. `/server/migrate.ts` - Database migration script
7. `/drizzle.config.ts` - Drizzle ORM configuration

## Usage

Instead of using `process.env.VARIABLE_NAME` directly in files, import the ENV object:

```typescript
import { ENV } from "@/utils/constants";

// Use ENV.VARIABLE_NAME instead of process.env.VARIABLE_NAME
const apiKey = ENV.ZILLOW_API_KEY;
```

## Validation

You can validate that all required environment variables are present by calling:

```typescript
import { validateEnvVars } from "@/utils/constants";

validateEnvVars(); // Throws error if any variables are missing
```

## Benefits

1. **Centralized Management**: All environment variables in one place
2. **Type Safety**: TypeScript support for environment variables
3. **Validation**: Built-in validation to catch missing variables
4. **Maintainability**: Easy to track what variables are used where
5. **Security**: Clear separation between example and actual values
