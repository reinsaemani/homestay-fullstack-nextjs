import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const connectionString = `${process.env.DIRECT_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("saemani98", 10);

  await prisma.user.upsert({
    where: { email: "reinsaemani@gmail.com" },
    update: {},
    create: {
      id: randomUUID(),
      name: "rein",
      email: "reinsaemani@gmail.com",
      password,
      role: "SUPER_ADMIN",
      updatedAt: new Date(),
    },
  });

  console.log("Seeded user: rein (SUPER_ADMIN)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
