import { readFileSync } from "fs";
import path from "path";

import { User } from "@prisma/client";
import { hash, compare } from "../../utils/auth";
import { Resolvers as UserResolvers } from "../../types/resolvers";
import { UserCheckStatus } from "../../types/schema";
import { loaderResetors } from "../loaders";
import UserValidator from "./UserValidator";

// Construct a schema, using GraphQL schema language
export const typeDef = readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf-8"
);

export const resolvers: UserResolvers = {
  User: {
    isPrivate: (user) => user.is_private,
    participations: async (
      { name },
      _,
      { loaders: { userParticipationsLoader } }
    ) => {
      const participations = await userParticipationsLoader.load(name);
      // console.log(`User.participations : ${JSON.stringify(participations)}`);
      return participations;
    },
  },
  Query: {
    getUser: async (_, { name }, { prisma }) => {
      const user = await prisma.user.findUnique({
        where: { name },
      });
      if (user) {
        return user;
      }

      throw new Error("No user found with given name");
    },
    getUsers: async (_, __, { prisma }) => {
      const users: User[] = await prisma.user.findMany();
      return users;
      // eturn users.map((it) => UserMapper.mapUser(it));
    },
    checkUser: async (_, { name, password }, { prisma }) => {
      const user = await prisma.user.findUnique({
        where: { name },
      });

      if (user) {
        const isPasswordCorrect = await compare(password, user.password);
        // User found and password is correct
        if (isPasswordCorrect) {
          return {
            user,
            status: UserCheckStatus.UserAndPasswordFound,
          };
        }
        // User found, but password is incorrect
        return { status: UserCheckStatus.InvalidPassword };
      }
      const hashedPassword = await hash(password);
      // If user is not created, create user after validating
      UserValidator.validateCreateUser(name);
      const createdUser = await prisma.user.create({
        data: { name, password: hashedPassword },
      });
      return {
        user: createdUser,
        status: UserCheckStatus.UserNotFoundButCreated,
      };
    },
  },
  Mutation: {
    addUser: async (_, args, { prisma }) => {
      const user = await prisma.user.create({
        data: { ...args, is_private: args.isPrivate || undefined },
      });
      return user;
    },
    deleteUser: async (_, { name }, { prisma, loaders }) => {
      // Clear participations loader cache
      await loaderResetors.clearParticipationsCacheByUser(name, loaders);
      // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
      const deletedUsers = await prisma.$executeRaw(
        `DELETE FROM "User" WHERE name='${name}';`
      );
      if (deletedUsers > 0) return true; // If more than 0 rows are affected by above query
      return false;
    },
  },
};
