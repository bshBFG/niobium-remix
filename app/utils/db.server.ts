import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
  prisma.$connect();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
    global.__db__.$connect();
  }
  prisma = global.__db__;
}

export { prisma };