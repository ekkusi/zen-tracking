import {
  Challenge,
  ChallengeParticipation,
  Marking,
  PrismaClient,
  User,
} from "@prisma/client";
import DataLoader from "dataloader";
import { Response } from "express";
import AwsS3Client from "../utils/awsS3Client";

export type AuthenticatedUser = Omit<User, "password" | "is_private"> & {
  isPrivate: boolean;
};

export type DataLoaders = {
  markingsLoader: DataLoader<string, Marking[], string>;
  challengeLoader: DataLoader<string, Challenge | Error, string>;
  userLoader: DataLoader<string, User | Error, string>;
  challengeParticipationsLoader: DataLoader<
    string,
    ChallengeParticipation[],
    string
  >;
  userParticipationsLoader: DataLoader<
    string,
    ChallengeParticipation[],
    string
  >;
};

export type CustomContext = {
  prisma: PrismaClient;
  s3Client: typeof AwsS3Client;
  res: Response;
  loaders: DataLoaders;
  user: AuthenticatedUser | null;
};
