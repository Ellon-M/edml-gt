// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPERUSER_EMAIL || "super@example.com";
  const password = process.env.SUPERUSER_PASSWORD || "SuperSecurePassword123!";
  const hashed = bcrypt.hashSync(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Superuser already exists:", email);
    return;
  }

  await prisma.user.create({
    data: {
      email,
      name: "Superuser",
      password: hashed,
      role: "SUPERUSER",
    },
  });

  console.log(`Superuser created: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
