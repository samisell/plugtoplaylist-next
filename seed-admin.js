const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { randomBytes } = require("crypto");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding admin users...");
  console.log("");

  const adminUsers = [
    {
      email: "admin@plugtoplaylist.com",
      name: "Admin User",
      password: "AdminPassword123!",
    },
    {
      email: "support@plugtoplaylist.com",
      name: "Support Admin",
      password: "SupportPass123!",
    },
  ];

  for (const adminData of adminUsers) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: adminData.email },
      });

      if (existingUser) {
        console.log(`✓ User ${adminData.email} already exists (skipping)`);

        if (existingUser.role !== "admin") {
          await prisma.user.update({
            where: { email: adminData.email },
            data: { role: "admin" },
          });
          console.log(`  Updated role to admin`);
        }
        continue;
      }

      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      const referralCode = randomBytes(4).toString("hex").toUpperCase();

      const user = await prisma.user.create({
        data: {
          email: adminData.email,
          name: adminData.name,
          password: hashedPassword,
          role: "admin",
          referralCode,
          emailVerified: new Date(),
        },
      });

      console.log(`✓ Created admin user: ${user.email}`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Referral Code: ${user.referralCode}`);
    } catch (error) {
      console.error(`✗ Error creating admin user ${adminData.email}:`, error.message);
    }
  }

  console.log("");
  console.log("✅ Seed complete!");
  console.log("");
  console.log("📝 Admin Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  adminUsers.forEach((user) => {
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
    console.log(`Login: http://localhost:3000/admin/login`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  });

  console.log("");
  console.log("⚠️  IMPORTANT: Change these default passwords in production!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
