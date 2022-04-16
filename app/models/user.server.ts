import type { Password, Profile, User } from "@prisma/client";
import { Role } from "@prisma/client";
import bcrypt from "@node-rs/bcrypt";

import { prisma } from "~/utils/db.server";

export type { User, Profile };

export { Role };

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function getAllUsersWithProfile() {
  return await prisma.user.findMany({
    include: {
      profile: true,
    },
  });
}

export async function getUserById(id: User["id"]) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function getUserWithProfileById(id: User["id"]) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  email: User["email"],
  password: string,
  role?: Role,
  image?: Profile["image"],
  firstName?: Profile["firstName"],
  secondName?: Profile["secondName"]
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      email,
      role,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      profile: {
        create: {
          image: image || null,
          firstName: firstName || null,
          secondName: secondName || null,
        },
      },
    },
  });
}

export async function deleteUserById(id: User["id"]) {
  return await prisma.user.delete({ where: { id } });
}

export async function deleteUserByEmail(email: User["email"]) {
  return await prisma.user.delete({ where: { email } });
}

export async function updateUserOnly(
  id: User["id"],
  email: User["email"],
  role: User["role"]
) {
  return await prisma.user.update({
    where: { id },
    data: {
      email,
      role,
    },
  });
}

export async function updatePasswordOnly(userId: User["id"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.password.update({
    where: { userId },
    data: {
      hash: hashedPassword,
    },
  });
}

export async function updateProfileOnly(
  userId: User["id"],
  image: Profile["image"],
  firstName: Profile["firstName"],
  secondName: Profile["secondName"]
) {
  const existsProfile = await prisma.profile.findFirst({
    where: { userId: userId },
  });

  if (existsProfile) {
    return await prisma.profile.update({
      where: { userId },
      data: {
        image: image || null,
        firstName: firstName || null,
        secondName: secondName || null,
      },
    });
  }

  return await prisma.profile.create({
    data: {
      userId,
      image: image || null,
      firstName: firstName || null,
      secondName: secondName || null,
    },
  });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.verify(password, userWithPassword.password.hash);

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function verifyPassword(
  userId: User["id"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return false;
  }

  const isValid = await bcrypt.verify(password, userWithPassword.password.hash);

  if (!isValid) {
    return false;
  }

  return true;
}
