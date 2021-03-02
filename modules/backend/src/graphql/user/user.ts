import { readFileSync } from "fs";
import path from "path";

import { hash, compare } from "../../utils/auth";
import { Resolvers as UserResolvers } from "../../types/user-resolvers";
import { UserCheckStatus } from "../../types/user";
import { UserMapper } from "./UserMapper";

// Construct a schema, using GraphQL schema language
export const typeDef = readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf-8"
);

export const resolvers: UserResolvers = {
  User: {
    markings: async ({ name }, _, { loaders: { markingLoader } }) => {
      const markings = await markingLoader.load(name);

      if (markings[name]) {
        return markings[name];
      }
      return [];
    },
  },
  Query: {
    getUser: async (_, { name }, { prisma }) => {
      const user = await prisma.user.findUnique({
        where: { name },
      });
      if (user) {
        return UserMapper.mapUser(user);
      }

      throw new Error("No user found with given name");
    },
    getUsers: async (_, __, { prisma }) => {
      const users = await prisma.user.findMany();
      return users.map((it) => UserMapper.mapUser(it));
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
            user: UserMapper.mapUser(user),
            status: UserCheckStatus.UserAndPasswordFound,
          };
        }
        // User found, but password is incorrect
        return { status: UserCheckStatus.InvalidPassword };
      }
      const hashedPassword = await hash(password);
      // If user is not created, create user
      const createdUser = await prisma.user.create({
        data: { name, password: hashedPassword },
      });
      return {
        user: UserMapper.mapUser(createdUser),
        status: UserCheckStatus.UserNotFoundButCreated,
      };
    },
  },
  Mutation: {
    addUser: async (_, args, { prisma }) => {
      const user = await prisma.user.create({
        data: { ...args, is_private: args.isPrivate || undefined },
      });
      return UserMapper.mapUser(user);
    },
    addMarking: async (_, args, { prisma }) => {
      const { userName, marking } = args;
      console.log("addMarking args:", JSON.stringify(marking));
      const createdMarking = await prisma.marking.create({
        data: UserMapper.mapCreateMarkingInput(userName, marking || {}),
      });
      return UserMapper.mapMarking(createdMarking);
    },
    editMarking: async (_, { id, marking }, { prisma }) => {
      console.log("editMarking args:", JSON.stringify(marking));
      try {
        const editMarking = await prisma.marking.update({
          where: { id },
          data: UserMapper.mapEditMarkingInput(marking),
        });
        return UserMapper.mapMarking(editMarking);
      } catch (error) {
        throw new Error(`editMarking error: marking with id ${id} not found`);
      }
    },
    deleteMarking: async (_, { id }, { prisma }) => {
      try {
        await prisma.marking.delete({ where: { id } });
        return true;
      } catch (error) {
        throw new Error(`deleteMarking error: marking with id ${id} not found`);
      }
    },
  },
};
