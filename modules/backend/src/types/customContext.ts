import { PrismaClient } from "@prisma/client";

export type CustomContext = {
  prisma: PrismaClient;
};
