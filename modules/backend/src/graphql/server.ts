import {
  ApolloError,
  ApolloServer,
  gql,
  IResolvers,
  makeExecutableSchema,
} from "apollo-server-express";
import { Application } from "express";
import merge from "lodash.merge";
import { v4 as generateId } from "uuid";

import { GraphQLError } from "graphql";

import {
  typeDef as customScalarTypeDef,
  resolvers as customScalarResolvers,
} from "./shared";

import { typeDef as userTypeDef, resolvers as userResolvers } from "./user";

import {
  typeDef as challengeTypeDef,
  resolvers as challengeResolvers,
} from "./challenge";

import prisma from "./client";
import ValidationError from "../utils/ValidationError";
import dataLoaders from "./loaders";

export default (app: Application): ApolloServer => {
  const context = { prisma, loaders: dataLoaders };

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
    userResolvers as IResolvers,
    challengeResolvers as IResolvers
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

      if (error.originalError instanceof ValidationError) {
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
