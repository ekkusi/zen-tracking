import { Challenge, ChallengeParticipation, Marking, PrismaClient, User } from "@prisma/client";
import DataLoader from "dataloader";

export type DataLoaders = {
  markingsLoader: DataLoader<string, Marking[], string>;
  challengeLoader: DataLoader<string, Challenge, string>;
  userLoader: DataLoader<string, User, string>;
  challengeParticipationsLoader: DataLoader<string, ChallengeParticipation[], string>;
  userParticipationsLoader: DataLoader<string, ChallengeParticipation[], string>;
};

export type CustomContext = {
  prisma: PrismaClient;
  loaders: DataLoaders;
};
