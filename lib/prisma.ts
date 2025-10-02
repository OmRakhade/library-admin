// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Attach Prisma to the NodeJS global object in development
// This avoids creating multiple instances during hot reload
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
