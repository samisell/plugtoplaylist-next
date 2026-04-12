# ✅ Admin User Seeding Complete

## Summary

Admin users have been successfully created in your database using Prisma!

### Created Admin Accounts

| Email | Password | Name | Role | Status |
|-------|----------|------|------|--------|
| `admin@plugtoplaylist.com` | `AdminPassword123!` | Admin User | admin | ✅ Created |
| `support@plugtoplaylist.com` | `SupportPass123!` | Support Admin | admin | ✅ Created |

### Database IDs

- **Admin User ID**: `cmnuqlgla00004pv0gmogf46o`
- **Support User ID**: `cmnuqlh2a00014pv01930ng3m`

---

## How It Works

### What Was Done

1. **Created Prisma Seed Script** (`prisma/seed.ts`)
   - TypeScript seed file that creates admin users
   - Hashes passwords with bcrypt (10 rounds)
   - Auto-generates referral codes
   - Pre-verifies email addresses
   - Checks for duplicates (won't overwrite existing users)

2. **Added Seed Configuration** (`package.json`)
   - Added `db:seed` npm script
   - Configured Prisma seed runner
   - Added `tsx` as dev dependency for running TypeScript

3. **Created Helper Scripts**
   - `run-seed.bat` - Windows batch script
   - `run-seed.sh` - Linux/macOS shell script
   - `seed-admin.js` - Standalone Node.js script (used for initial seeding)

4. **Database Updates**
   - Schema is synced (no migrations needed)
   - Admin users inserted into `User` table
   - Referral codes generated automatically

### File Structure

```
plugtoplaylist-next/
├── prisma/
│   ├── schema.prisma          (Database schema)
│   └── seed.ts                (TypeScript seed script)
├── seed-admin.js              (Standalone Node.js seed)
├── run-seed.bat               (Windows helper)
├── run-seed.sh                (Linux/macOS helper)
├── SEEDING.md                 (Full documentation)
└── package.json               (Updated with seed config)
```

---

## Using the Admin Portal

### Login

1. Visit: **http://localhost:3000/admin/login**
2. Use one of the admin credentials above
3. You'll be redirected to **http://localhost:3000/admin**

### Navigation

From regular user login page (`http://localhost:3000/login`):
- Click **"Admin Portal"** link at the bottom
- Or navigate directly to `/admin/login`

### Features

✅ Separate session cookies (`ptp_admin_id` vs `ptp_user_id`)  
✅ Role-based access control  
✅ Admin dashboard with logout  
✅ Protected admin routes  
✅ Clear separation from user authentication  

---

## Re-Running the Seed

If you need to run the seed again later:

### Quick Method (Recommended)
```bash
node seed-admin.js
```

### Using npm Script
```bash
npm run db:seed
```

### Manual TypeScript Method
```bash
npm install tsx --save-dev
npx prisma db seed
```

---

## Customization

### Change Default Passwords

Edit `seed-admin.js` and update these lines:

```javascript
const adminUsers = [
  {
    email: "admin@plugtoplaylist.com",
    name: "Admin User",
    password: "YOUR_NEW_PASSWORD_HERE",  // Change this
  },
  {
    email: "support@plugtoplaylist.com",
    name: "Support Admin",
    password: "YOUR_NEW_PASSWORD_HERE",  // Change this
  },
];
```

Then run: `node seed-admin.js`

### Add More Admin Users

Edit `seed-admin.js` and add to the `adminUsers` array:

```javascript
const adminUsers = [
  // ... existing users ...
  {
    email: "newadmin@plugtoplaylist.com",
    name: "New Admin",
    password: "NewPassword123!",
  },
];
```

### Using Environment Variables

Create `.env.local`:
```
ADMIN_PASSWORD_1=secure_password_here
ADMIN_PASSWORD_2=another_secure_password
```

Update seed script to use these instead of hardcoded values.

---

## Production Considerations

### ⚠️ IMPORTANT Security Notes

1. **Change Default Passwords**
   - Before going to production, absolutely change these passwords
   - Use strong, unique passwords (12+ characters, mixed case, numbers, symbols)
   - Never commit default passwords to version control

2. **Environment Variables**
   - Move sensitive data to `.env` or `.env.production`
   - Use a secret management system (AWS Secrets Manager, Vault, etc.)
   - Never hardcode passwords in seed files

3. **Access Control**
   - Limit who has admin credentials
   - Use two-factor authentication (if implementing)
   - Monitor admin login activities
   - Implement audit logs

4. **Password Rotation**
   - Implement regular password rotation policy
   - Force password change on first admin login
   - Log password change events

---

## Troubleshooting

### Issue: "User already exists"
✅ **Expected behavior** - Seed script won't create duplicates
- Run again safely without recreating existing users
- To reset, delete users from database first

### Issue: "Connection refused"
❌ **Database not running**
- Check if MySQL is running: `mysql --version`
- Verify `DATABASE_URL` in `.env` is correct
- Start your database service

### Issue: "Module not found: @prisma/client"
```bash
npm install
npx prisma generate
```

### Issue: File "seed not working"
Try the standalone script:
```bash
node seed-admin.js
```

---

## Next Steps

### For Development
1. ✅ Admin users created
2. Test admin login at `/admin/login`
3. Explore admin dashboard
4. Implement additional admin features as needed

### For Production
1. ✅ Admin users created
2. ⚠️ **CHANGE DEFAULT PASSWORDS IMMEDIATELY**
3. Set up secure password management
4. Implement 2FA (optional but recommended)
5. Configure audit logging
6. Set up database backups
7. Test admin workflows thoroughly

---

## Additional Resources

- **Prisma Documentation**: https://www.prisma.io/docs/
- **Prisma Seeding**: https://www.prisma.io/docs/guides/migrate/seed-database
- **bcrypt Documentation**: https://www.npmjs.com/package/bcrypt
- **Full Seeding Guide**: See `SEEDING.md`

---

## Quick Reference

| Task | Command |
|------|---------|
| Re-run seed | `node seed-admin.js` |
| View database | `npx prisma studio` |
| Generate client | `npx prisma generate` |
| Sync schema | `npx prisma db push` |
| Reset database | `npx prisma migrate reset` |

---

## Support

If you encounter issues:

1. Check error messages carefully
2. Verify `.env` DATABASE_URL
3. Ensure database is running
4. Try standalone script: `node seed-admin.js`
5. Check database logs for errors

---

**Created**: April 11, 2026  
**Status**: ✅ Complete - Admin users seeded to database
