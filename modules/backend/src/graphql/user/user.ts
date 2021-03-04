import { readFileSync } from "fs";
import path from "path";

import { hash, compare } from "../../utils/auth";
import { Resolvers as UserResolvers } from "../../types/user-resolvers";
import { UserCheckStatus } from "../../types/user";
import { UserMapper } from "./UserMapper";
import { UserValidator } from "./UserValidator";
import ValidationError from "../../utils/ValidationError";

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
    addMarking: async (_, args, { prisma, loaders }) => {
      const { userName, marking } = args;
      console.log("addMarking args:", JSON.stringify(marking));

      // Check validity and throw error if not valid
      const validity = await UserValidator.validateAddMarking(args);
      if (validity instanceof ValidationError) throw validity;

      const createdMarking = await prisma.marking.create({
        data: UserMapper.mapCreateMarkingInput(userName, marking || {}),
      });

      // Clear markingLoader cache for user after create
      loaders.markingLoader.clear(createdMarking.user_name);
      return UserMapper.mapMarking(createdMarking);
    },
    editMarking: async (_, args, { prisma, loaders }) => {
      console.log("editMarking args:", JSON.stringify(args));
      const { id, marking } = args;
      // Check validity and throw error if not valid
      const validity = await UserValidator.validateMarkingInput(marking);
      if (validity instanceof ValidationError) throw validity;

      const editMarking = await prisma.marking.update({
        where: { id },
        data: UserMapper.mapEditMarkingInput(marking),
      });

      // Clear markingLoader cache for user after update
      loaders.markingLoader.clear(editMarking.user_name);
      return UserMapper.mapMarking(editMarking);
    },
    deleteMarking: async (_, { id }, { prisma, loaders }) => {
      try {
        const deletedMarking = await prisma.marking.delete({ where: { id } });

        // Clear markingLoader cache for user after delete
        loaders.markingLoader.clear(deletedMarking.user_name);
        return true;
      } catch (error) {
        throw new Error(`deleteMarking error: marking with id ${id} not found`);
      }
    },
  },
};
