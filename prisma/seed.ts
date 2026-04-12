import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding admin users...");

  // Admin user data
  const adminUsers = [
    {
      email: "admin@plugtoplaylist.com",
      name: "Admin User",
      password: "AdminPassword123!", // Change this to a secure password
    },
    {
      email: "support@plugtoplaylist.com",
      name: "Support Admin",
      password: "SupportPass123!", // Change this to a secure password
    },
  ];

  for (const adminData of adminUsers) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: adminData.email },
      });

      if (existingUser) {
        console.log(`✓ User ${adminData.email} already exists (skipping)`);
        
        // Update role to admin if not already
        if (existingUser.role !== "admin") {
          await prisma.user.update({
            where: { email: adminData.email },
            data: { role: "admin" },
          });
          console.log(`  Updated role to admin`);
        }
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      const referralCode = randomBytes(4).toString("hex").toUpperCase();

      // Create admin user
      const user = await prisma.user.create({
        data: {
          email: adminData.email,
          name: adminData.name,
          password: hashedPassword,
          role: "admin",
          referralCode,
          emailVerified: new Date(), // Admin emails are pre-verified
        },
      });

      console.log(`✓ Created admin user: ${user.email} (ID: ${user.id})`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Referral Code: ${user.referralCode}`);
    } catch (error) {
      console.error(`✗ Error creating admin user ${adminData.email}:`, error);
    }
  }

  console.log("\n✅ Seed complete!");
  console.log("\n📝 Admin Users Created:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  adminUsers.forEach((user) => {
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
    console.log(`Login at: http://localhost:3000/admin/login`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  });

  console.log("\n⚠️  IMPORTANT: Change these default passwords in production!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
