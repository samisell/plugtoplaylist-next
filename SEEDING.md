# Database Seeding Guide

## Admin User Setup

This project includes a Prisma seed script that creates admin users in your database.

### What Gets Created

The seed script creates two admin users:

1. **Admin User**
   - Email: `admin@plugtoplaylist.com`
   - Default Password: `AdminPassword123!`
   - Role: `admin`

2. **Support Admin**
   - Email: `support@plugtoplaylist.com`
   - Default Password: `SupportPass123!`
   - Role: `admin`

### Running the Seed

#### Option 1: Use the Windows Batch Script (Windows Users)
```bash
# Double-click this file in File Explorer:
run-seed.bat
```

#### Option 2: Use the Shell Script (Linux/macOS Users)
```bash
bash run-seed.sh
```

#### Option 3: Manual Commands

**Step 1: Install tsx (if not already installed)**
```bash
npm install tsx --save-dev
```

**Step 2: Generate Prisma Client**
```bash
npx prisma generate
```

**Step 3: Run the Seed Script**
```bash
npx prisma db seed
```

Or use the npm script:
```bash
npm run db:seed
```

### Seed Script Features

- ✅ Creates admin users with hashed passwords (bcrypt)
- ✅ Auto-generates referral codes
- ✅ Pre-verifies admin emails
- ✅ Checks for existing users (won't create duplicates)
- ✅ Updates existing user roles to admin if needed
- ✅ Displays clear success/error messages

### What Happens During Seed

1. Connects to your database using `DATABASE_URL`
2. Checks if each admin user already exists
3. If not, creates the user with:
   - Hashed password using bcrypt (10 rounds)
   - Random referral code
   - Email pre-verified
   - Admin role assigned
4. If user exists but isn't admin, updates role to admin
5. Displays all created credentials for reference

### After Seeding

**Login to Admin Portal:**
1. Visit: `http://localhost:3000/admin/login`
2. Use one of the admin credentials created above
3. You'll be redirected to `/admin` dashboard

**Important Security Notes:**
⚠️ **CHANGE DEFAULT PASSWORDS IN PRODUCTION!**

1. Update default passwords:
   ```bash
   # Update via database or admin panel after logging in
   ```

2. For production, use strong passwords:
   - At least 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Unique passwords for each admin

3. Consider using environment variables for seed passwords:
   ```bash
   # In .env or .env.local
   ADMIN_DEFAULT_PASSWORD=your_secure_password_here
   ```

### Troubleshooting

**Error: "Module not found: tsx"**
```bash
npm install tsx --save-dev
```

**Error: "DATABASE_URL not set"**
- Check your `.env` file has `DATABASE_URL` configured
- Ensure database is running and accessible

**Error: "User already exists"**
- The seed script won't create duplicates
- To reset, either delete users from database or it will update their role to admin

**Want to Reset Database?**
```bash
npx prisma migrate reset
# This will:
# 1. Drop all data
# 2. Re-run migrations
# 3. Run seed script automatically
```

### File Structure

- `prisma/seed.ts` - TypeScript seed script
- `package.json` - Contains seed script configuration
- `run-seed.sh` - Linux/macOS helper script
- `run-seed.bat` - Windows helper script

### Further Customization

Edit `prisma/seed.ts` to:
- Change default admin emails
- Add more admin users
- Create sample data for other models
- Pre-populate plans, settings, etc.

### Seed Script Code

Located in `prisma/seed.ts` - feel free to customize it for your needs!
