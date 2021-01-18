import {
  ApolloServer,
  gql,
  IResolvers,
  makeExecutableSchema,
} from "apollo-server-express";
import { Application } from "express";
import { PrismaClient } from "@prisma/client";
import merge from "lodash.merge";

import {
  typeDef as userTypeDef,
  resolvers as userResolvers,
} from "./user/user";

import {
  typeDef as customScalarTypeDef,
  resolvers as customScalarResolvers,
} from "./scalars/customScalars";

const prisma = new PrismaClient();

export default (app: Application): ApolloServer => {
  const context = { prisma };

  const queryTypeDef = gql`
    type Query {
      _empty: String
    }
    type Mutation {
      _empty: String
    }
  `;

  const typeDefs = [queryTypeDef, customScalarTypeDef, userTypeDef];

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
  });

  server.applyMiddleware({
    app,
  });

  return server;
};
