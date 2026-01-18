# Quick Start Guide - Real Estate Project

## 🚀 Getting Started in 5 Minutes

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Neon DB account)
- Git installed

### Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/realestate"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ImageKit (for image uploads)
IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
IMAGEKIT_URL_ENDPOINT="your-imagekit-url-endpoint"
```

### Step 3: Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Apply migrations
npx prisma migrate dev

# (Optional) Seed database
# Create a seed script in prisma/seed.ts if needed
```

### Step 4: Create Admin User

You have two options:

**Option A: Using Prisma Studio**

```bash
npm run db:studio
```

Then:

1. Open Prisma Studio (http://localhost:5555)
2. Go to "user" table
3. Click "Add record"
4. Fill in:
   - email: admin@example.com
   - password: (hash it first using bcrypt)
   - role: admin
   - firstName: Admin
   - lastName: User
5. Save

**Option B: Using SQL**

```sql
-- Connect to your database and run:
INSERT INTO "user" (id, email, password, role, "firstName", "lastName")
VALUES (
  'admin-id-123',
  'admin@example.com',
  '$2a$10$YourHashedPasswordHere', -- Hash your password first
  'admin',
  'Admin',
  'User'
);
```

To hash a password, you can use this Node.js command:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword123', 10));"
```

### Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

---

## 📱 Application URLs

### Public Pages

- **Home**: http://localhost:3000
- **Properties**: http://localhost:3000/Properties
- **Property Details**: http://localhost:3000/Properties/[id]
- **About**: http://localhost:3000/about
- **Privacy**: http://localhost:3000/privacy

### Authentication

- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register

### User Dashboard

- **Dashboard**: http://localhost:3000/dashboard
- **Upload Property**: http://localhost:3000/upload

### Admin Panel

- **Admin Dashboard**: http://localhost:3000/admin
- **Property Management**: http://localhost:3000/admin/properties
- **Add Property**: http://localhost:3000/admin/Addproperties
- **Settings**: http://localhost:3000/admin/settings

---

## 🧪 Testing the Application

### Test User Registration

1. Go to http://localhost:3000/register
2. Fill in the registration form:
   - First Name
   - Last Name
   - Email
   - Password
   - Location
   - Role (Buyer/Seller)
   - Skill Level
3. Submit and login

### Test Property Submission

1. Login as a registered user
2. Go to http://localhost:3000/upload
3. Fill in property details
4. Upload images
5. Submit property
6. Note: Property will be in "pending" status

### Test Admin Approval

1. Login as admin
2. Go to http://localhost:3000/admin/properties
3. Click "Pending Approvals" tab
4. Review submitted properties
5. Click "Approve" or "Reject"

### Test Inquiry System

1. Browse to a property details page
2. Scroll to contact form
3. Fill in inquiry details
4. Submit inquiry
5. Property owner can view inquiries

### Test Search & Filters

1. Go to http://localhost:3000/Properties
2. Use search bar to search by location
3. Apply filters:
   - Price range
   - Property type
   - Bedrooms/Bathrooms
4. View filtered results

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database (dev)
npm run db:migrate     # Create and apply migration
npm run db:studio      # Open Prisma Studio
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"

**Solution**: Check your DATABASE_URL in .env file is correct

### Issue: "NEXTAUTH_SECRET is not defined"

**Solution**: Add NEXTAUTH_SECRET to your .env file

```bash
# Generate a secret:
openssl rand -base64 32
```

### Issue: "Module not found" errors

**Solution**:

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue: "Prisma Client is not initialized"

**Solution**:

```bash
npm run db:generate
```

### Issue: "Migration failed"

**Solution**: Use db:push for development

```bash
npm run db:push
```

### Issue: "Images not uploading"

**Solution**: Check ImageKit credentials in .env

### Issue: "Cannot access admin panel"

**Solution**: Ensure user has role='admin' in database

---

## 📊 Database Management

### View Data

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555

### Reset Database (Development Only!)

```bash
npx prisma migrate reset
```

⚠️ **WARNING**: This will delete all data!

### Backup Database

```bash
# PostgreSQL example
pg_dump -U username -d database_name > backup.sql
```

### Restore Database

```bash
# PostgreSQL example
psql -U username -d database_name < backup.sql
```

---

## 🎯 Feature Testing Checklist

### Authentication ✓

- [ ] User can register
- [ ] User can login with email/password
- [ ] User can login with Google OAuth
- [ ] User session persists
- [ ] User can logout
- [ ] Admin can access admin panel
- [ ] Non-admin cannot access admin panel

### Property Management ✓

- [ ] User can submit property
- [ ] Property goes to pending status
- [ ] User can view own properties
- [ ] User can edit own properties
- [ ] User can delete own properties
- [ ] Admin can view all properties
- [ ] Admin can approve properties
- [ ] Admin can reject properties

### Search & Filter ✓

- [ ] Search by location works
- [ ] Price filter works
- [ ] Property type filter works
- [ ] Beds/baths filter works
- [ ] Results update in real-time

### Inquiry System ✓

- [ ] Contact form appears on property page
- [ ] User can send inquiry
- [ ] Inquiry saved to database
- [ ] Property owner can view inquiries
- [ ] Inquiry status can be updated

### Admin Features ✓

- [ ] Admin dashboard shows statistics
- [ ] Admin can see pending properties
- [ ] Admin can approve/reject properties
- [ ] Admin can view all users
- [ ] Admin can promote/demote users

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to vercel.com
3. Import repository
4. Add environment variables
5. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
IMAGEKIT_URL_ENDPOINT="your-imagekit-url-endpoint"
```

---

## 📞 Support

If you encounter any issues:

1. Check the error message carefully
2. Review the documentation
3. Check Prisma Studio for data issues
4. Review console logs in browser DevTools
5. Check terminal logs for server errors

---

## 🎉 You're Ready!

Your Real Estate application is now fully set up and ready to use.

**Happy coding!** 🚀
