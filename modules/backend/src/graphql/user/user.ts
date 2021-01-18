import { readFileSync } from "fs";
import path from "path";
import { Resolvers as UserResolvers, UserCheckResult } from "../../types/user";
import { UserMapper } from "./UserMapper";

// Construct a schema, using GraphQL schema language
export const typeDef = readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf-8"
);

// Provide resolver functions for your schema fields
export const resolvers: UserResolvers = {
  Query: {
    getUser: async (parent, args, context) => {
      const { prisma } = context;
      const user = await prisma.user.findUnique({
        where: { name: args.name },
      });
      if (user) {
        const markings = await prisma.marking.findMany({
          where: { userName: user.name },
        });
        return UserMapper.mapUser(user, markings);
      }
      throw new Error("No user found with given name");
    },
    checkUser: async (parent, args, context) => {
      const { prisma } = context;
      const user = await prisma.user.findUnique({
        where: { name: args.name },
      });
      if (user) {
        return user.password === args.password
          ? UserCheckResult.UserAndPasswordFound
          : UserCheckResult.InvalidPassword;
      }
      const createdUser = await prisma.user.create({
        data: { ...args },
      });
      return UserCheckResult.UserNotFoundButCreated;
    },
  },
  Mutation: {
    addUser: async (parent, args, context) => {
      const { prisma } = context;
      const user = await prisma.user.create({
        data: { ...args, isPrivate: args.isPrivate || undefined },
      });
      return UserMapper.mapUser(user, []);
    },
    addMarking: async (parent, args, context) => {
      const { prisma } = context;
      const { userName, marking } = args;
      console.log("Adding marking:", JSON.stringify(marking));
      const createdMarking = await prisma.marking.create({
        data: UserMapper.mapMarkingInput(userName, marking),
      });
      return UserMapper.mapMarking(createdMarking);
    },
  },
};
