import { readFileSync } from "fs";
import path from "path";

import { User } from "@prisma/client";
import {
  hash,
  compare,
  createRefreshToken,
  createAccessToken,
  createRefreshTokenCookie,
} from "../../utils/auth";
import { Resolvers as UserResolvers } from "../../types/resolvers";
import { loaderResetors } from "../loaders";
import UserValidator from "./UserValidator";
import AuthenticationError from "../../utils/errors/AuthenticationError";

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
    },
  },
  Mutation: {
    deleteUser: async (_, { name }, { prisma, loaders, user }) => {
      if (!user) throw new AuthenticationError();
      // Clear participations loader cache
      await loaderResetors.clearParticipationsCacheByUser(name, loaders);
      // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
      const deletedUsers = await prisma.$executeRaw(
        `DELETE FROM "User" WHERE name='${name}';`
      );
      if (deletedUsers > 0) return true; // If more than 0 rows are affected by above query
      return false;
    },
    login: async (_, { name, password }, { prisma, res }) => {
      const user = await prisma.user.findUnique({
        where: { name },
      });
      if (!user) {
        throw new AuthenticationError(`Käyttäjää nimellä ${name} ei löytynyt`);
      }

      const isValid = await compare(password, user.password);
      if (!isValid) {
        throw new AuthenticationError("Antamasi salasana oli väärä");
      }
      const { password: __, ...userWithoutPassword } = user;

      createRefreshTokenCookie(createRefreshToken(userWithoutPassword), res);

      return {
        accessToken: createAccessToken(userWithoutPassword),
      };
    },
    register: async (_, { name, password }, { prisma, res }) => {
      await UserValidator.validateCreateUser(name);

      const createdUser = await prisma.user.create({
        data: { name, password: await hash(password) },
      });

      const { password: __, ...userWithoutPassword } = createdUser;

      createRefreshTokenCookie(createRefreshToken(userWithoutPassword), res);

      return {
        accessToken: createAccessToken(userWithoutPassword),
      };
    },
  },
};
