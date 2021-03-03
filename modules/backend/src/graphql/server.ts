import {
  ApolloError,
  ApolloServer,
  gql,
  IResolvers,
  makeExecutableSchema,
} from "apollo-server-express";
import { Application } from "express";
import { PrismaClient } from "@prisma/client";
import merge from "lodash.merge";
import { v4 as generateId } from "uuid";

import { GraphQLError } from "graphql";

import {
  typeDef as customScalarTypeDef,
  resolvers as customScalarResolvers,
} from "./scalars/customScalars";

import {
  typeDef as userTypeDef,
  resolvers as userResolvers,
} from "./user/user";

import { typeDef as challengeTypeDef } from "./challenge/challenge";

import createLoaders from "./loaders";

const isProd = process.env.NODE_ENV === "production";

// If in development, log prisma queries and errors
const prisma = new PrismaClient({
  log: isProd ? [] : ["query", "info", "warn", "error"],
});

export default (app: Application): ApolloServer => {
  const loaders = createLoaders(prisma);
  const context = { prisma, loaders };

  const queryTypeDef = gql`
    type Query {
      _empty: String
    }
    type Mutation {
      _empty: String
    }
  `;

  const typeDefs = [
    queryTypeDef,
    customScalarTypeDef,
    userTypeDef,
    challengeTypeDef,
  ];

  const resolvers = merge(
    {},
    customScalarResolvers,
    userResolvers as IResolvers
  );

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    context,
    formatError: (error) => {
      // If error is ApolloError, return original error. You could create other custom errors here like InputError etc.
      if (error.originalError instanceof ApolloError) {
        return error;
      }

      // Generate custom internal erros. Only show error id to client if error is Internal error. You can then check from app logs what the matching error actually is to debug.
      const errorId = generateId();
      console.log(`error id: ${errorId}`);
      console.log(JSON.stringify(error));
      return new GraphQLError(
        `Internal error: ${errorId}. \n\nJos vaan millään soppii, niin voisitko välittää tämän virheen idn sivun omistajalle ekeukolle:)`
      );
    },
  });

  server.applyMiddleware({
    app,
  });

  return server;
};
