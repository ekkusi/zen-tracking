import { PrismaClient } from "@prisma/client";

const isProd = process.env.NODE_ENV === "production";

// If in development, log prisma queries and errors
const prisma = new PrismaClient({
  log: isProd ? [] : ["query", "info", "warn", "error"],
});

export default prisma;
