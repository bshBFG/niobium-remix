import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const email = "john@doe.com";

  await prisma.user.create({
    data: {
      email,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
