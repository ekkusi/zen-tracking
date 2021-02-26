import { Marking, PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";

export type CustomContext = {
  prisma: PrismaClient;
  markingLoader: DataLoader<unknown, Marking, unknown>;
};
