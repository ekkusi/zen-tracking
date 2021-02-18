import { readFileSync } from "fs";
import path from "path";
import { CustomContext } from "../../types/customContext";

import { hash, compare } from "../../utils/auth";
import {
  QueryGetUserArgs,
  Resolvers as UserResolvers,
  ResolversParentTypes,
  User,
  UserCheckResult,
  UserCheckStatus,
  QueryCheckUserArgs,
  MutationAddUserArgs,
  MutationAddMarkingArgs,
  Marking,
} from "../../types/user";
import { UserMapper } from "./UserMapper";

// Construct a schema, using GraphQL schema language
export const typeDef = readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf-8"
);

const queryResolvers = {
  getUser: async (
    parent: ResolversParentTypes["Query"],
    args: QueryGetUserArgs,
    context: CustomContext
  ): Promise<User> => {
    const { prisma } = context;
    const user = await prisma.user.findUnique({
      where: { name: args.name },
    });
    if (user) {
      const markings = await prisma.marking.findMany({
        where: { user_name: user.name },
      });
      return UserMapper.mapUser(user, markings);
    }

    throw new Error("No user found with given name");
  },
  checkUser: async (
    parent: ResolversParentTypes["Query"],
    args: QueryCheckUserArgs,
    context: CustomContext
  ): Promise<UserCheckResult> => {
    const { prisma } = context;
    const user = await prisma.user.findUnique({
      where: { name: args.name },
    });

    if (user) {
      const isPasswordCorrect = await compare(args.password, user.password);
      // User found and password is correct
      if (isPasswordCorrect) {
        const userWithMarkings = await queryResolvers.getUser(
          parent,
          { name: args.name },
          context
        );
        return {
          user: userWithMarkings,
          status: UserCheckStatus.UserAndPasswordFound,
        };
      }
      // User found, but password is incorrect
      return { status: UserCheckStatus.InvalidPassword };
    }
    const hashedPassword = await hash(args.password);
    // If user is not created, create user
    const createdUser = await prisma.user.create({
      data: { ...args, password: hashedPassword },
    });
    return {
      user: UserMapper.mapUser(createdUser, []),
      status: UserCheckStatus.UserNotFoundButCreated,
    };
  },
};

const mutationResolvers = {
  addUser: async (
    parent: ResolversParentTypes["Mutation"],
    args: MutationAddUserArgs,
    context: CustomContext
  ): Promise<User> => {
    const { prisma } = context;
    const user = await prisma.user.create({
      data: { ...args, is_private: args.isPrivate || undefined },
    });
    return UserMapper.mapUser(user, []);
  },
  addMarking: async (
    parent: ResolversParentTypes["Mutation"],
    args: MutationAddMarkingArgs,
    context: CustomContext
  ): Promise<Marking> => {
    const { prisma } = context;
    const { userName, marking } = args;
    const createdMarking = await prisma.marking.create({
      data: UserMapper.mapMarkingInput(userName, marking),
    });
    return UserMapper.mapMarking(createdMarking);
  },
};

// Provide resolver functions for your schema fields
export const resolvers: UserResolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};
