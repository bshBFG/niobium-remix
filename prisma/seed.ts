import { PrismaClient } from "@prisma/client";
import bcrypt from "@node-rs/bcrypt";

import { Role } from "prisma/prisma-client";

const prisma = new PrismaClient();

const demoUsers = [
  {
    email: "jon@snow.com",
    password: "qwerty",
    role: Role.ADMIN,
    profile: {
      firstName: "Jon",
      secondName: "Snow",
      image:
        "https://cdni.rbth.com/rbthmedia/images/all/2016/05/17/Game%20of%20Thrones/game-of-thrones-2588149.jpg",
    },
  },
  {
    email: "daenerys@targaryen.com",
    password: "qwerty",
    role: Role.USER,
    profile: {
      firstName: "Daenerys",
      secondName: "Targaryen",
      image:
        "https://img4.goodfon.ru/wallpaper/nbig/a/56/game-of-thrones-daenerys-targaryen-emilia-clarke.jpg",
    },
  },
];

async function seed() {
  demoUsers.forEach(async (user) => {
    await prisma.user.delete({ where: { email: user.email } }).catch(() => {});

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        email: user.email,
        role: user.role,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
        profile: {
          create: {
            firstName: user.profile.firstName,
            secondName: user.profile.secondName,
            image: user.profile.image,
          },
        },
      },
    });
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
