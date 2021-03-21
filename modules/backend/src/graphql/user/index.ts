import { readFileSync } from "fs";
import path from "path";

import { User } from "@prisma/client";
import {
  hash,
  createRefreshToken,
  createAccessToken,
  createRefreshTokenCookie,
} from "../../utils/auth";
import { Resolvers as UserResolvers } from "../../types/resolvers";
import { loaderResetors } from "../loaders";
import UserValidator from "./UserValidator";
import AuthenticationError from "../../utils/errors/AuthenticationError";
import { UserMapper } from "./UserMapper";
import UserInfoUtil from "../../utils/UserInfoUtil";

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
    activeParticipation: async ({ name }, { challengeId }, { prisma }) => {
      // If challengeId arg is passed, return this as activeParticipation if it is found. Otherwise fetch latest modified participation
      if (challengeId) {
        const participation = await prisma.challengeParticipation.findFirst({
          where: { challenge_id: challengeId, user_name: name },
        });

        return participation;
      }
      // Latest modified participation
      return UserInfoUtil.getLatestModifiedParticipation(name);
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

      throw new Error(`Käyttäjää nimellä ${name} ei löytynyt`);
    },
    getCurrentUser: async (_, __, { prisma, user }) => {
      if (!user) throw new AuthenticationError();

      const matchingUser = await prisma.user.findUnique({
        where: { name: user.name },
      });

      if (matchingUser) {
        return matchingUser;
      }

      throw new Error(`Käyttäjää ei löytynyt`);
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
    login: async (_, { name, password }, { res }) => {
      const user = await UserValidator.validateLoginUser(name, password);

      createRefreshTokenCookie(
        createRefreshToken(UserMapper.mapAuthenticatedUser(user)),
        res
      );

      return {
        accessToken: createAccessToken(UserMapper.mapAuthenticatedUser(user)),
        user,
      };
    },
    logout: async (_, __, { res }) => {
      createRefreshTokenCookie("", res);

      return true;
    },
    register: async (_, { name, password, isPrivate }, { prisma, res }) => {
      await UserValidator.validateCreateUser(name);

      const createdUser = await prisma.user.create({
        data: { name, password: await hash(password), is_private: isPrivate },
      });

      createRefreshTokenCookie(
        createRefreshToken(UserMapper.mapAuthenticatedUser(createdUser)),
        res
      );

      return {
        accessToken: createAccessToken(
          UserMapper.mapAuthenticatedUser(createdUser)
        ),
        user: createdUser,
      };
    },
  },
};
