import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { MarkingsLoadResult } from "./dataLoader";

export type DataLoaders = {
  markingLoader: DataLoader<string, MarkingsLoadResult, string>;
};

export type CustomContext = {
  prisma: PrismaClient;
  loaders: DataLoaders;
};
