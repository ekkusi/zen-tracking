import { readFileSync } from "fs";
import path from "path";

import { Prisma, User } from "@prisma/client";
import {
  createRefreshTokenCookie,
  createRefreshAndAccessTokens,
} from "../../utils/auth";
import { Resolvers as UserResolvers } from "../../types/resolvers";
import { loaderResetors } from "../loaders";
import UserValidator from "./UserValidator";
import AuthenticationError from "../../utils/errors/AuthenticationError";
import { UserMapper } from "./UserMapper";
import UserInfoUtil from "../../utils/UserInfoUtil";
import { SharedMapper } from "../shared/SharedMapper";
import { formatIsoString } from "../../utils/dateUtils";

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
      { loaders: { userParticipationsLoader }, user }
    ) => {
      const participations = await userParticipationsLoader.load(name);
      const notPrivateOrCurrentUserParticipations = participations.filter(
        (it) => !it.is_private || it.user_name === user?.name
      );
      // console.log(`User.participations : ${JSON.stringify(participations)}`);
      return notPrivateOrCurrentUserParticipations;
    },
    activeParticipation: async ({ name }, { id }, { prisma, user }) => {
      // If challengeId arg is passed, return this as activeParticipation if it is found. Otherwise fetch latest modified participation
      if (id) {
        const participation = await prisma.challengeParticipation.findUnique({
          where: { id },
        });

        if (participation) {
          if (
            participation.is_private &&
            participation.user_name !== user?.name
          )
            return null;
          return participation;
        }
      }
      // Latest modified participation
      const latestParticipation = await UserInfoUtil.getLatestModifiedParticipation(
        name
      );

      if (
        latestParticipation?.is_private &&
        latestParticipation?.user_name !== user?.name
      )
        return null;
      return latestParticipation;
    },
    finishedAndCheckedParticipations: (user) =>
      user.finished_and_checked_participations,
    createdAt: ({ created_at }) => formatIsoString(created_at),
    hasCheckedLatestUpdate: (user) => user.has_checked_latest_update,
  },
  Query: {
    getUser: async (_, { name }, { prisma, user: currentUser }) => {
      const user = await prisma.user.findUnique({
        where: { name },
      });
      if (user && (!user.is_private || user.name === currentUser?.name)) {
        return user;
      }

      return null;
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
    getUsers: async (_, __, { prisma, user }) => {
      const notPrivateOrCurrentUserFilters = SharedMapper.notPrivateFilterMapper<Prisma.UserWhereInput>(
        {},
        { name: user?.name }
      );
      const users: User[] = await prisma.user.findMany({
        where: notPrivateOrCurrentUserFilters,
      });
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

      return {
        accessToken: createRefreshAndAccessTokens(
          UserMapper.mapAuthenticatedUser(user),
          res
        ),
        user,
      };
    },
    logout: async (_, __, { res }) => {
      createRefreshTokenCookie("", res);

      return true;
    },

    editUser: async (_, args, { prisma, user, res }) => {
      if (!user) throw new AuthenticationError();
      await UserValidator.validateEditUser(args, user);
      const editedUser = await prisma.user.update({
        where: {
          name: user.name,
        },
        data: await UserMapper.mapEditUserInput(args),
      });

      return {
        accessToken: createRefreshAndAccessTokens(
          UserMapper.mapAuthenticatedUser(editedUser),
          res
        ),
        user: editedUser,
      };
    },

    register: async (_, args, { prisma, res }) => {
      await UserValidator.validateCreateUser(args);

      const createdUser = await prisma.user.create({
        data: await UserMapper.mapCreateUserInput(args),
      });

      return {
        accessToken: createRefreshAndAccessTokens(
          UserMapper.mapAuthenticatedUser(createdUser),
          res
        ),
        user: createdUser,
      };
    },

    addFinishedParticipation: async (_, args, { prisma, user }) => {
      if (!user) throw new AuthenticationError();
      await prisma.user.update({
        data: {
          finished_and_checked_participations: {
            set: [args.id, ...user.finishedAndCheckedParticipations],
          },
        },
        where: { name: user.name },
      });
      return true;
    },

    checkLatestUpdate: async (_, args, { prisma, user }) => {
      if (!user) throw new AuthenticationError();
      await prisma.user.update({
        data: {
          has_checked_latest_update: true,
        },
        where: { name: user.name },
      });
      return true;
    },
  },
};
